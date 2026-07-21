#!/usr/bin/env python3
"""MVP Contractを読み、参照・成果物・品質ゲートを検証してJSONレポートを出す。"""

from __future__ import annotations

import argparse
import datetime as dt
import json
from pathlib import Path
import subprocess
import sys
import time
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
OS_ROOT = SCRIPT_DIR.parents[1]
DEFAULT_KNOWLEDGE_DIR = OS_ROOT / "technical_decision_os" / "knowledge"
CONTRACT_REQUIRED = {
    "contract_version",
    "mvp_id",
    "title",
    "owner",
    "created_at",
    "hypothesis",
    "user",
    "scope",
    "data",
    "acceptance",
    "technical_decisions",
    "quality_gate",
    "demo",
    "decision",
    "result",
}


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def collect_knowledge_ids(root: Path) -> set[str]:
    ids: set[str] = set()
    for path in root.rglob("*.json"):
        try:
            data = read_json(path)
        except (OSError, json.JSONDecodeError):
            continue
        if isinstance(data, dict) and isinstance(data.get("id"), str):
            ids.add(data["id"])
    return ids


def check_nonempty(value: Any) -> bool:
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, list):
        return bool(value)
    return value is not None


def validate_contract(contract: dict[str, Any], contract_path: Path, project_root: Path, knowledge_ids: set[str]) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    missing = sorted(CONTRACT_REQUIRED - contract.keys())
    if missing:
        errors.append(f"Contract必須項目不足: {', '.join(missing)}")
        return errors, warnings

    for field in ("mvp_id", "title", "owner"):
        if not check_nonempty(contract.get(field)):
            errors.append(f"{field}が空です")

    hypothesis = contract.get("hypothesis", {})
    for field in ("statement", "evidence", "falsification"):
        if not check_nonempty(hypothesis.get(field)):
            errors.append(f"hypothesis.{field}が空です")

    user = contract.get("user", {})
    for field in ("role", "decision_to_make"):
        if not check_nonempty(user.get(field)):
            errors.append(f"user.{field}が空です")

    scope = contract.get("scope", {})
    for field in ("input", "processing", "output", "out_of_scope"):
        if not check_nonempty(scope.get(field)):
            errors.append(f"scope.{field}が空です")

    data = contract.get("data", {})
    classification = data.get("classification")
    if classification not in {"L1", "L2", "L3"}:
        errors.append(f"data.classificationが不正: {classification!r}")
    if classification == "L3" and data.get("local_processing_required") is not True:
        errors.append("L3データはlocal_processing_required=trueが必要です")
    if not check_nonempty(data.get("datasets")):
        errors.append("data.datasetsが空です")

    golden_dataset = data.get("golden_dataset")
    if not check_nonempty(golden_dataset):
        errors.append("data.golden_datasetが空です")
    else:
        golden_path = (contract_path.parent / golden_dataset).resolve() if not Path(golden_dataset).is_absolute() else Path(golden_dataset)
        if not golden_path.exists():
            errors.append(f"Golden Datasetが存在しません: {golden_path}")
        else:
            try:
                payload = read_json(golden_path)
                cases = payload if isinstance(payload, list) else payload.get("cases", []) if isinstance(payload, dict) else []
                if not cases:
                    errors.append("Golden Datasetにcaseがありません")
                elif len(cases) < 3:
                    warnings.append("Golden Caseが3件未満です。正常・境界・判定不能を含めてください")
                categories = {case.get("category") for case in cases if isinstance(case, dict)}
                if "abstention" not in categories:
                    warnings.append("Golden Datasetにabstentionケースがありません")
            except (OSError, json.JSONDecodeError) as exc:
                errors.append(f"Golden Datasetを読めません: {exc}")

    acceptance = contract.get("acceptance", {})
    for field in ("functional", "quality", "abstention"):
        if not check_nonempty(acceptance.get(field)):
            errors.append(f"acceptance.{field}が空です")

    decisions = contract.get("technical_decisions", {})
    referenced: list[str] = []
    for field in ("required_ids", "compatibility_checks", "known_failures", "migration_rules"):
        value = decisions.get(field, [])
        if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
            errors.append(f"technical_decisions.{field}は文字列配列にしてください")
        else:
            referenced.extend(value)
    if not referenced:
        warnings.append("Technical Decision IDが1件もありません。採用理由を再現できません")
    for item_id in referenced:
        if item_id not in knowledge_ids:
            errors.append(f"存在しないTechnical Decision ID: {item_id}")

    quality_gate = contract.get("quality_gate", {})
    commands = quality_gate.get("commands", [])
    if not isinstance(commands, list):
        errors.append("quality_gate.commandsは配列にしてください")
    elif not commands:
        warnings.append("品質ゲートコマンドがありません")

    artifacts = quality_gate.get("required_artifacts", [])
    if not isinstance(artifacts, list):
        errors.append("quality_gate.required_artifactsは配列にしてください")
    else:
        for artifact in artifacts:
            path = project_root / artifact
            if not path.exists():
                errors.append(f"必須成果物がありません: {path}")

    demo = contract.get("demo", {})
    modes = demo.get("modes", [])
    if "live" not in modes:
        warnings.append("demo.modesにliveがありません")
    if not ({"replay", "mock"} & set(modes if isinstance(modes, list) else [])):
        errors.append("demo.modesにはreplayまたはmockが必要です")
    if not check_nonempty(demo.get("fallback")):
        errors.append("demo.fallbackが空です")

    decision = contract.get("decision", {})
    for field in ("pass", "pivot", "kill"):
        if not check_nonempty(decision.get(field)):
            errors.append(f"decision.{field}が空です")

    return errors, warnings


def run_commands(commands: list[dict[str, Any]], project_root: Path, no_exec: bool) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for index, spec in enumerate(commands):
        name = spec.get("name") or f"command-{index + 1}"
        argv = spec.get("argv")
        required = bool(spec.get("required", True))
        timeout = int(spec.get("timeout_seconds", 300))
        if not isinstance(argv, list) or not argv or not all(isinstance(v, str) for v in argv):
            results.append({"name": name, "required": required, "status": "invalid", "argv": argv})
            continue
        if no_exec:
            results.append({"name": name, "required": required, "status": "skipped", "argv": argv})
            continue
        started = time.monotonic()
        try:
            proc = subprocess.run(
                argv,
                cwd=project_root,
                text=True,
                capture_output=True,
                timeout=timeout,
                check=False,
            )
            status = "passed" if proc.returncode == 0 else "failed"
            results.append({
                "name": name,
                "required": required,
                "status": status,
                "argv": argv,
                "returncode": proc.returncode,
                "duration_seconds": round(time.monotonic() - started, 3),
                "stdout_tail": proc.stdout[-4000:],
                "stderr_tail": proc.stderr[-4000:],
            })
        except FileNotFoundError as exc:
            results.append({"name": name, "required": required, "status": "failed", "argv": argv, "error": str(exc)})
        except subprocess.TimeoutExpired as exc:
            results.append({"name": name, "required": required, "status": "timeout", "argv": argv, "error": str(exc)})
    return results


def main() -> int:
    parser = argparse.ArgumentParser(description="MVP Contract quality gate")
    parser.add_argument("--contract", type=Path, required=True)
    parser.add_argument("--project-root", type=Path, required=True)
    parser.add_argument("--knowledge-dir", type=Path, default=DEFAULT_KNOWLEDGE_DIR)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--no-exec", action="store_true", help="コマンドを実行せずContract検証だけ行う")
    args = parser.parse_args()

    contract_path = args.contract.resolve()
    project_root = args.project_root.resolve()
    report_path = args.report.resolve() if args.report else contract_path.with_name(f"{contract_path.stem}.quality-report.json")

    try:
        contract = read_json(contract_path)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"Contractを読めません: {exc}", file=sys.stderr)
        return 1
    if not isinstance(contract, dict):
        print("Contract top levelはobjectにしてください", file=sys.stderr)
        return 1

    knowledge_ids = collect_knowledge_ids(args.knowledge_dir.resolve())
    errors, warnings = validate_contract(contract, contract_path, project_root, knowledge_ids)
    commands = contract.get("quality_gate", {}).get("commands", [])
    command_results = run_commands(commands if isinstance(commands, list) else [], project_root, args.no_exec)

    required_failures = [
        item for item in command_results
        if item.get("required") and item.get("status") not in {"passed", "skipped"}
    ]
    block_on_failure = bool(contract.get("quality_gate", {}).get("block_on_failure", True))
    status = "passed"
    if errors or (block_on_failure and required_failures):
        status = "blocked"
    elif warnings:
        status = "passed_with_warnings"

    report = {
        "mvp_id": contract.get("mvp_id"),
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "contract": str(contract_path),
        "project_root": str(project_root),
        "status": status,
        "errors": errors,
        "warnings": warnings,
        "commands": command_results,
    }
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if status == "blocked" else 0


if __name__ == "__main__":
    sys.exit(main())

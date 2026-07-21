#!/usr/bin/env python3
"""Technical Decision OS のJSON知識を標準ライブラリだけで検証する。"""

from __future__ import annotations

import argparse
import datetime as dt
import json
from pathlib import Path
import re
import sys
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_KNOWLEDGE_DIR = ROOT / "knowledge"
VALID_KINDS = {"decision", "compatibility", "failure", "benchmark", "migration"}
VALID_STATUSES = {"candidate", "active", "rejected", "retired"}
VALID_EVIDENCE = {f"E{i}" for i in range(6)}
ID_PREFIX = {
    "decision": "DEC-",
    "compatibility": "COMP-",
    "failure": "FAIL-",
    "benchmark": "BENCH-",
    "migration": "MIG-",
}
KIND_REQUIRED = {
    "decision": {"conditions", "recommend", "avoid", "tradeoffs", "switch_triggers"},
    "compatibility": {"components", "relation", "constraints", "failure_symptoms", "mitigations"},
    "failure": {"symptom", "root_cause", "bad_combination", "diagnosis", "fix", "prevention_tests"},
    "benchmark": {"problem", "candidates", "dataset", "metrics", "results", "winner", "limitations"},
    "migration": {"from", "to", "triggers", "migration_cost", "rollback"},
}
COMMON_REQUIRED = {
    "id",
    "kind",
    "title",
    "status",
    "domains",
    "summary",
    "evidence",
    "confidence",
    "last_verified",
    "review_due",
    "tags",
}
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def parse_date(value: Any, field: str, errors: list[str]) -> dt.date | None:
    if not isinstance(value, str) or not DATE_RE.match(value):
        errors.append(f"{field}: YYYY-MM-DD形式ではありません: {value!r}")
        return None
    try:
        return dt.date.fromisoformat(value)
    except ValueError:
        errors.append(f"{field}: 存在しない日付です: {value!r}")
        return None


def evidence_score(level: str) -> int:
    return int(level[1]) if level in VALID_EVIDENCE else -1


def validate_item(data: dict[str, Any], path: Path) -> tuple[list[str], list[str], set[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    referenced_ids: set[str] = set()

    missing = sorted(COMMON_REQUIRED - data.keys())
    if missing:
        errors.append(f"必須項目不足: {', '.join(missing)}")

    kind = data.get("kind")
    if kind not in VALID_KINDS:
        errors.append(f"kindが不正: {kind!r}")
    else:
        missing_kind = sorted(KIND_REQUIRED[kind] - data.keys())
        if missing_kind:
            errors.append(f"{kind}必須項目不足: {', '.join(missing_kind)}")

    item_id = data.get("id")
    if not isinstance(item_id, str) or not item_id:
        errors.append("idが空です")
    elif kind in ID_PREFIX and not item_id.startswith(ID_PREFIX[kind]):
        errors.append(f"id接頭辞がkindと不一致: {item_id} / {kind}")

    status = data.get("status")
    if status not in VALID_STATUSES:
        errors.append(f"statusが不正: {status!r}")

    confidence = data.get("confidence")
    if not isinstance(confidence, (int, float)) or isinstance(confidence, bool) or not 0 <= confidence <= 1:
        errors.append(f"confidenceは0〜1: {confidence!r}")

    domains = data.get("domains")
    if not isinstance(domains, list) or not domains or not all(isinstance(v, str) and v for v in domains):
        errors.append("domainsは空でない文字列配列にしてください")

    tags = data.get("tags")
    if not isinstance(tags, list) or not all(isinstance(v, str) for v in tags):
        errors.append("tagsは文字列配列にしてください")

    evidence = data.get("evidence")
    max_level = -1
    if not isinstance(evidence, list) or not evidence:
        errors.append("evidenceは1件以上必要です")
    else:
        for index, item in enumerate(evidence):
            if not isinstance(item, dict):
                errors.append(f"evidence[{index}]はobjectにしてください")
                continue
            for key in ("level", "type", "source", "verified_at", "notes"):
                if key not in item:
                    errors.append(f"evidence[{index}].{key}がありません")
            level = item.get("level")
            if level not in VALID_EVIDENCE:
                errors.append(f"evidence[{index}].levelが不正: {level!r}")
            else:
                max_level = max(max_level, evidence_score(level))
            parse_date(item.get("verified_at"), f"evidence[{index}].verified_at", errors)

    last_verified = parse_date(data.get("last_verified"), "last_verified", errors)
    review_due = parse_date(data.get("review_due"), "review_due", errors)
    if last_verified and review_due and review_due < last_verified:
        errors.append("review_dueがlast_verifiedより前です")
    if review_due and review_due < dt.date.today() and status == "active":
        warnings.append(f"再検証期限超過: {review_due.isoformat()}")

    if status == "active" and max_level < 2:
        errors.append("active知識は最低E2が必要です。未検証ならcandidateにしてください")
    if status == "active" and max_level == 2:
        warnings.append("E2のみのactive知識です。PoC標準には使えるが、本番標準にはしないでください")
    if max_level >= 0 and isinstance(confidence, (int, float)):
        cap = {0: 0.35, 1: 0.55, 2: 0.80, 3: 0.97, 4: 1.0, 5: 1.0}[max_level]
        if confidence > cap:
            warnings.append(f"Evidence E{max_level}に対してconfidenceが高すぎます（推奨上限 {cap}）")

    related = data.get("related_ids", [])
    if not isinstance(related, list) or not all(isinstance(v, str) for v in related):
        errors.append("related_idsは文字列配列にしてください")
    else:
        referenced_ids.update(related)

    if path.stem != item_id:
        warnings.append(f"ファイル名とidが不一致: {path.stem} != {item_id}")

    return errors, warnings, referenced_ids


def main() -> int:
    parser = argparse.ArgumentParser(description="Technical Decision OS knowledge validator")
    parser.add_argument("--knowledge-dir", type=Path, default=DEFAULT_KNOWLEDGE_DIR)
    parser.add_argument("--strict-warnings", action="store_true", help="warningも失敗扱いにする")
    args = parser.parse_args()

    paths = sorted(args.knowledge_dir.rglob("*.json"))
    if not paths:
        print(f"知識JSONが見つかりません: {args.knowledge_dir}", file=sys.stderr)
        return 1

    ids: dict[str, Path] = {}
    all_references: dict[Path, set[str]] = {}
    total_errors = 0
    total_warnings = 0

    for path in paths:
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            print(f"ERROR {path}: JSONを読めません: {exc}")
            total_errors += 1
            continue
        if not isinstance(data, dict):
            print(f"ERROR {path}: top levelはobjectにしてください")
            total_errors += 1
            continue

        item_id = data.get("id")
        if isinstance(item_id, str) and item_id:
            if item_id in ids:
                print(f"ERROR {path}: id重複 {item_id}（既出: {ids[item_id]}）")
                total_errors += 1
            else:
                ids[item_id] = path

        errors, warnings, refs = validate_item(data, path)
        all_references[path] = refs
        for message in errors:
            print(f"ERROR {path}: {message}")
        for message in warnings:
            print(f"WARN  {path}: {message}")
        total_errors += len(errors)
        total_warnings += len(warnings)

    known_ids = set(ids)
    for path, refs in all_references.items():
        for ref in sorted(refs - known_ids):
            print(f"ERROR {path}: related_idsの参照先が存在しません: {ref}")
            total_errors += 1

    print(f"\nchecked={len(paths)} errors={total_errors} warnings={total_warnings}")
    if total_errors or (args.strict_warnings and total_warnings):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

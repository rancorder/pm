#!/usr/bin/env python3
"""PM Brainの案件ファイルをfrontmatterと本文から検索する。標準ライブラリのみ。"""

from __future__ import annotations

import argparse
from pathlib import Path
import re
import sys
from typing import Any

CASES_DIR = Path(__file__).resolve().parent.parent / "cases"
LIST_FIELDS = {
    "cause_category",
    "tech_category",
    "decision_ids",
    "compatibility_ids",
    "failure_ids",
    "benchmark_ids",
    "migration_ids",
}


def parse_frontmatter(text: str) -> tuple[dict[str, Any], str]:
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.DOTALL)
    if not match:
        return {}, text
    frontmatter, body = match.group(1), match.group(2)
    meta: dict[str, Any] = {}
    for raw in frontmatter.splitlines():
        line = raw.rstrip()
        if not line or line.lstrip().startswith("#") or ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        value = value.strip()
        if value.startswith("[") and value.endswith("]"):
            inner = value[1:-1].strip()
            meta[key] = [part.strip().strip('"').strip("'") for part in inner.split(",") if part.strip()]
        else:
            meta[key] = value.strip('"').strip("'")
    for field in LIST_FIELDS:
        meta.setdefault(field, [])
    return meta, body


def load_cases() -> list[dict[str, Any]]:
    cases: list[dict[str, Any]] = []
    if not CASES_DIR.exists():
        return cases
    for path in sorted(CASES_DIR.glob("*.md")):
        if path.name.startswith("_"):
            continue
        text = path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(text)
        title_match = re.search(r"^# (.+)$", body, re.MULTILINE)
        meta["_path"] = str(path)
        meta["_body"] = body
        meta["_title"] = title_match.group(1) if title_match else path.stem
        cases.append(meta)
    return cases


def list_contains(case: dict[str, Any], field: str, value: str | None) -> bool:
    if not value:
        return True
    items = case.get(field, [])
    if isinstance(items, str):
        items = [items]
    return value in items


def matches(case: dict[str, Any], args: argparse.Namespace) -> bool:
    exact_fields = {
        "industry": args.industry,
        "phase": args.phase,
        "status": args.status,
        "poc_result": args.poc_result,
        "max_evidence": args.evidence,
    }
    for field, expected in exact_fields.items():
        if expected and case.get(field, "") != expected:
            return False

    list_filters = {
        "cause_category": args.cause,
        "tech_category": args.tech,
        "decision_ids": args.decision,
        "compatibility_ids": args.compatibility,
        "failure_ids": args.failure,
        "benchmark_ids": args.benchmark,
        "migration_ids": args.migration,
    }
    if any(not list_contains(case, field, value) for field, value in list_filters.items()):
        return False

    if args.keyword:
        haystack = f"{case.get('_title', '')}\n{case.get('_body', '')}".casefold()
        if args.keyword.casefold() not in haystack:
            return False
    return True


def section(body: str, heading: str) -> str:
    pattern = rf"^## (?:\d+\. )?{re.escape(heading)}\n(.*?)(?=^## |\Z)"
    match = re.search(pattern, body, re.MULTILINE | re.DOTALL)
    return match.group(1).strip() if match else ""


def print_case(case: dict[str, Any], verbose: bool) -> None:
    print(f"[{case.get('case_id', '?')}] {case.get('_title', '')}")
    print(f"  client={case.get('client', '')} industry={case.get('industry', '')} phase={case.get('phase', '')}")
    print(f"  cause={case.get('cause_category', [])} tech={case.get('tech_category', [])}")
    print(f"  status={case.get('status', '')} poc={case.get('poc_result', '')} evidence={case.get('max_evidence', '')}")
    print(f"  decisions={case.get('decision_ids', [])} failures={case.get('failure_ids', [])}")
    print(f"  contract={case.get('mvp_contract', '')} quality={case.get('quality_report', '')}")
    print(f"  path={case.get('_path', '')}")
    if verbose:
        lesson = section(case.get("_body", ""), "次案件に使える学び")
        technical = section(case.get("_body", ""), "技術判断の結果")
        if lesson:
            print(f"  学び: {lesson[:300]}")
        if technical:
            print(f"  技術結果: {technical[:300]}")
    print()


def main() -> int:
    parser = argparse.ArgumentParser(description="PM Brain case search")
    parser.add_argument("--industry")
    parser.add_argument("--phase")
    parser.add_argument("--cause")
    parser.add_argument("--tech")
    parser.add_argument("--status")
    parser.add_argument("--poc-result")
    parser.add_argument("--evidence", choices=[f"E{i}" for i in range(6)])
    parser.add_argument("--decision")
    parser.add_argument("--compatibility")
    parser.add_argument("--failure")
    parser.add_argument("--benchmark")
    parser.add_argument("--migration")
    parser.add_argument("--keyword")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    cases = load_cases()
    if not cases:
        print(f"案件ファイルが見つかりません: {CASES_DIR}")
        return 1
    hits = [case for case in cases if matches(case, args)]
    print(f"{len(hits)} 件ヒット（全{len(cases)}件中）\n")
    for case in hits:
        print_case(case, args.verbose)
    return 0


if __name__ == "__main__":
    sys.exit(main())

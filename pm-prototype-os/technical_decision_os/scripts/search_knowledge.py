#!/usr/bin/env python3
"""Technical Decision OS の知識JSONを検索する。"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_KNOWLEDGE_DIR = ROOT / "knowledge"


def load_items(root: Path) -> list[tuple[Path, dict[str, Any]]]:
    items: list[tuple[Path, dict[str, Any]]] = []
    for path in sorted(root.rglob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        if isinstance(data, dict):
            items.append((path, data))
    return items


def max_evidence(data: dict[str, Any]) -> int:
    values: list[int] = []
    for item in data.get("evidence", []):
        if isinstance(item, dict):
            level = item.get("level")
            if isinstance(level, str) and len(level) == 2 and level[0] == "E" and level[1].isdigit():
                values.append(int(level[1]))
    return max(values, default=-1)


def contains(value: Any, needle: str) -> bool:
    return needle.casefold() in json.dumps(value, ensure_ascii=False).casefold()


def matches(data: dict[str, Any], args: argparse.Namespace) -> bool:
    if args.id and data.get("id") != args.id:
        return False
    if args.kind and data.get("kind") != args.kind:
        return False
    if args.status and data.get("status") != args.status:
        return False
    if args.domain:
        domains = [str(v).casefold() for v in data.get("domains", [])]
        if args.domain.casefold() not in domains:
            return False
    if args.tag:
        tags = [str(v).casefold() for v in data.get("tags", [])]
        if args.tag.casefold() not in tags:
            return False
    if args.min_evidence is not None and max_evidence(data) < args.min_evidence:
        return False
    if args.keyword and not contains(data, args.keyword):
        return False
    return True


def compact(path: Path, data: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": data.get("id"),
        "kind": data.get("kind"),
        "status": data.get("status"),
        "title": data.get("title"),
        "domains": data.get("domains", []),
        "evidence_max": f"E{max_evidence(data)}" if max_evidence(data) >= 0 else None,
        "confidence": data.get("confidence"),
        "review_due": data.get("review_due"),
        "summary": data.get("summary"),
        "path": str(path),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Technical Decision OS knowledge search")
    parser.add_argument("--knowledge-dir", type=Path, default=DEFAULT_KNOWLEDGE_DIR)
    parser.add_argument("--id")
    parser.add_argument("--kind", choices=["decision", "compatibility", "failure", "benchmark", "migration"])
    parser.add_argument("--status", choices=["candidate", "active", "rejected", "retired"])
    parser.add_argument("--domain")
    parser.add_argument("--tag")
    parser.add_argument("--keyword")
    parser.add_argument("--min-evidence", type=int, choices=range(0, 6))
    parser.add_argument("--json", action="store_true", help="JSONで全内容を出力")
    args = parser.parse_args()

    hits = [(p, d) for p, d in load_items(args.knowledge_dir) if matches(d, args)]
    if args.json:
        payload = [{"path": str(path), **data} for path, data in hits]
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        print(f"{len(hits)} 件ヒット\n")
        for path, data in hits:
            row = compact(path, data)
            print(f"[{row['id']}] {row['title']}")
            print(f"  kind={row['kind']} status={row['status']} evidence={row['evidence_max']} confidence={row['confidence']}")
            print(f"  domains={', '.join(row['domains'])} review_due={row['review_due']}")
            print(f"  {row['summary']}")
            print(f"  path={row['path']}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())

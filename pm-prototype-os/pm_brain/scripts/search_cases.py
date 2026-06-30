#!/usr/bin/env python3
"""
search_cases.py — PM Brain の案件ファイルを検索する。

外部ライブラリ不要（標準ライブラリのみ）。pm_brain/cases/ 配下の
*.md を読み、YAML風frontmatterと本文を対象に検索する。

使い方:
    python3 search_cases.py --industry 建築
    python3 search_cases.py --cause Data
    python3 search_cases.py --keyword 版管理
    python3 search_cases.py --status MVP検証中
    python3 search_cases.py --industry 建築 --cause Data --keyword 図面

引数を何も付けずに実行すると、全ケースの一覧（タイトル・主要メタ情報）を出す。
"""

import argparse
import pathlib
import re
import sys

CASES_DIR = pathlib.Path(__file__).resolve().parent.parent / "cases"


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """先頭の --- ... --- ブロックを簡易パースする。複雑なYAMLは想定しない。"""
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.DOTALL)
    if not m:
        return {}, text
    fm_text, body = m.group(1), m.group(2)
    meta: dict = {}
    for line in fm_text.splitlines():
        line = line.rstrip()
        if not line or line.lstrip().startswith("#"):
            continue
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        value = value.strip()
        if value.startswith("[") and value.endswith("]"):
            inner = value[1:-1].strip()
            items = [v.strip().strip('"').strip("'") for v in inner.split(",") if v.strip()]
            meta[key] = items
        else:
            meta[key] = value.strip('"').strip("'")
    return meta, body


def load_cases() -> list[dict]:
    cases = []
    if not CASES_DIR.exists():
        return cases
    for path in sorted(CASES_DIR.glob("*.md")):
        if path.name.startswith("_"):
            continue  # _template.md などをスキップ
        text = path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(text)
        meta["_path"] = str(path)
        meta["_body"] = body
        title_match = re.search(r"^# (.+)$", body, re.MULTILINE)
        meta["_title"] = title_match.group(1) if title_match else path.stem
        cases.append(meta)
    return cases


def matches(case: dict, args) -> bool:
    if args.industry and case.get("industry", "") != args.industry:
        return False
    if args.phase and case.get("phase", "") != args.phase:
        return False
    if args.status and case.get("status", "") != args.status:
        return False
    if args.cause:
        causes = case.get("cause_category", [])
        if isinstance(causes, str):
            causes = [causes]
        if args.cause not in causes:
            return False
    if args.tech:
        techs = case.get("tech_category", [])
        if isinstance(techs, str):
            techs = [techs]
        if args.tech not in techs:
            return False
    if args.keyword:
        haystack = case.get("_body", "") + " " + case.get("_title", "")
        if args.keyword not in haystack:
            return False
    return True


def print_case(case: dict, verbose: bool) -> None:
    print(f"[{case.get('case_id', '?')}] {case.get('_title', '')}")
    print(f"  client: {case.get('client', '')} / industry: {case.get('industry', '')} / phase: {case.get('phase', '')}")
    print(f"  cause: {case.get('cause_category', [])} / tech: {case.get('tech_category', [])}")
    print(f"  status: {case.get('status', '')} / poc_result: {case.get('poc_result', '')}")
    print(f"  path: {case.get('_path', '')}")
    if verbose:
        lesson_match = re.search(
            r"## 次案件に使える学び\n(.*?)(\n##|\Z)", case.get("_body", ""), re.DOTALL
        )
        if lesson_match:
            lesson = lesson_match.group(1).strip()
            if lesson:
                print(f"  学び: {lesson[:200]}")
    print()


def main() -> int:
    parser = argparse.ArgumentParser(description="PM Brain case search")
    parser.add_argument("--industry", help="業界で絞り込む（例: 建築）")
    parser.add_argument("--phase", help="フェーズで絞り込む（例: 実施設計）")
    parser.add_argument("--cause", help="真因カテゴリで絞り込む（例: Data）")
    parser.add_argument("--tech", help="技術カテゴリで絞り込む（例: RAG）")
    parser.add_argument("--status", help="ステータスで絞り込む")
    parser.add_argument("--keyword", help="本文・タイトルのキーワード検索")
    parser.add_argument("-v", "--verbose", action="store_true", help="学びの抜粋も表示する")
    args = parser.parse_args()

    cases = load_cases()
    if not cases:
        print(f"案件ファイルが見つかりません: {CASES_DIR}")
        print("pm_brain/cases/_template.md をコピーして案件を追加してください。")
        return 1

    hits = [c for c in cases if matches(c, args)]

    print(f"{len(hits)} 件ヒット（全{len(cases)}件中）\n")
    for case in hits:
        print_case(case, args.verbose)

    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
run_vdr.py — Virtual Design Review 3ターン構成の自動オーケストレーション。

role_separation_protocol.md の Turn 1 → 2-A / 2-B → Turn 3 を
Anthropic API で自動実行する。PMの手作業を「入力ファイル準備」と
「Turn 3 出力を読んで最終判断」の2つに絞るのが目的。

使い方:
    export ANTHROPIC_API_KEY=sk-...
    python3 run_vdr.py --input request.md --outdir ./vdr_out
    python3 run_vdr.py --input request.md --independent   # 完全独立モード

入力ファイル（request.md）は role_separation_protocol.md の
「# 入力」セクション（顧客要望/背景/現在業務/...）を埋めたMarkdown。

出力:
    vdr_out/turn1_five_roles.md
    vdr_out/turn2a_ai_engineer.md
    vdr_out/turn2b_risk_ops.md
    vdr_out/turn3_integration.md   ← PMはこれを読んで判断する

注意（00_data_policy.md 準拠）:
    入力に L3 データを含めないこと。実行前に匿名化を済ませる。
"""

import argparse
import os
import pathlib
import sys
import urllib.request
import json

API_URL = "https://api.anthropic.com/v1/messages"
MODEL = os.environ.get("VDR_MODEL", "claude-sonnet-4-6")
MAX_TOKENS = int(os.environ.get("VDR_MAX_TOKENS", "4000"))

ROLES_5 = "Construction Domain Expert / Product Manager / Software Architect / UX Designer / Business Owner"

TURN1 = """あなたたちは建設DXプロダクトのバーチャル設計レビュー委員会です。
以下の顧客要望を、5つの専門家ロール（{roles}）でレビューしてください。
AI EngineerとRisk/Operations Reviewerは別途レビューするため含めないでください。

各ロールの出力: この要望の見え方 / 疑うべき真因 / 追加質問 / 推奨MVP / 実装上の注意 / 反対意見・懸念 / 評価(S/A/B/C)

# 入力
{request}"""

TURN2A = """あなたはAI Engineerとして、以下の顧客要望を独立にレビューしてください。
{context_clause}

出力: この要望の見え方 / 疑うべき真因 / 追加質問 / 推奨MVP / 実装上の注意 / 反対意見・懸念 / 評価(S/A/B/C)

注意:
- AIで解決できると安易に結論づけない
- 精度・根拠表示・評価方法・人間レビューの設計を必ず含める

# 顧客要望
{request}
{turn1_block}"""

TURN2B = """あなたはRisk / Operations Reviewerとして、以下の顧客要望を独立にレビューしてください。
AI Engineerのレビュー結果はまだ存在しないものとして判断してください。
{context_clause}

出力: この要望の見え方 / 疑うべき真因 / 追加質問 / 推奨MVP / 実装上の注意 / 反対意見・懸念 / 評価(S/A/B/C)

注意:
- セキュリティ・権限・監査ログ・契約・品質・安全上の責任を必ず検討する
- 「AIが楽観的に見ている領域」を想定して、あえて悲観的な視点から検証する

# 顧客要望
{request}
{turn1_block}"""

TURN3 = """以下の7ロールのレビュー結果を統合してください。
AI EngineerとRisk/Operations Reviewerの評価が食い違う場合、その対立点を整理してください。

# 統合出力
1. 真因候補ランキング
2. 最初に聞くべき質問
3. MVP候補の比較（採用推奨とその理由、不採用候補と理由）
4. 推奨UIパターン
5. 推奨技術構成
6. PoC成功条件
7. 主要リスク
8. 今回やらないこと
9. Claude Code / Codex向け実装指示（ドラフト）
10. AI Engineer vs Risk/Ops の対立点と、各主張の要約

# 重要: 次の2項目は絶対に出力しないこと。空欄のまま見出しだけ置くこと。
## PM最終判断（PMが記入）
## 判断理由（PMが記入）
これらはPM本人が記入する。AIが代筆してはならない。

# 顧客要望
{request}

# Turn 1（5ロール）
{t1}

# Turn 2-A（AI Engineer）
{t2a}

# Turn 2-B（Risk/Operations）
{t2b}"""


def call_api(prompt: str) -> str:
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        sys.exit("ANTHROPIC_API_KEY が未設定です")
    body = json.dumps({
        "model": MODEL,
        "max_tokens": MAX_TOKENS,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()
    req = urllib.request.Request(API_URL, data=body, headers={
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
    })
    with urllib.request.urlopen(req, timeout=600) as r:
        data = json.loads(r.read())
    return "\n".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, help="顧客要望の入力Markdown")
    ap.add_argument("--outdir", default="./vdr_out")
    ap.add_argument("--independent", action="store_true",
                    help="完全独立モード: Turn 2にTurn 1出力を見せない（アンカリング排除、重案件向け）")
    args = ap.parse_args()

    request = pathlib.Path(args.input).read_text(encoding="utf-8")
    out = pathlib.Path(args.outdir)
    out.mkdir(parents=True, exist_ok=True)

    print("[1/4] Turn 1: 5ロール一括生成...")
    t1 = call_api(TURN1.format(roles=ROLES_5, request=request))
    (out / "turn1_five_roles.md").write_text(t1, encoding="utf-8")

    if args.independent:
        clause = "他ロールのレビュー結果は一切参照せず、完全に独立して判断してください。"
        t1_block = ""
    else:
        clause = "参考として他5ロールのレビュー結果を渡しますが、結論は独立に出してください。"
        t1_block = f"\n# Turn 1の5ロールレビュー結果\n{t1}"

    print("[2/4] Turn 2-A: AI Engineer 独立生成...")
    t2a = call_api(TURN2A.format(context_clause=clause, request=request, turn1_block=t1_block))
    (out / "turn2a_ai_engineer.md").write_text(t2a, encoding="utf-8")

    print("[3/4] Turn 2-B: Risk/Operations 独立生成...")
    t2b = call_api(TURN2B.format(context_clause=clause, request=request, turn1_block=t1_block))
    (out / "turn2b_risk_ops.md").write_text(t2b, encoding="utf-8")

    print("[4/4] Turn 3: 統合...")
    t3 = call_api(TURN3.format(request=request, t1=t1, t2a=t2a, t2b=t2b))
    (out / "turn3_integration.md").write_text(t3, encoding="utf-8")

    print(f"\n完了。{out}/turn3_integration.md を開き、")
    print("『PM最終判断』『判断理由』の2欄を自分で記入してください。")


if __name__ == "__main__":
    main()

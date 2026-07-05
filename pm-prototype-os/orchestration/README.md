# Orchestration

VDR 3ターン構成を手動コピペで回すと、それだけで30分ゴールが溶ける。実行レイヤーをここに置く。

## run_vdr.py

`virtual_design_review/role_separation_protocol.md` の Turn 1 → 2-A/2-B → Turn 3 を1コマンドで自動実行する。標準ライブラリのみ・依存ゼロ。

```bash
export ANTHROPIC_API_KEY=sk-...
python3 run_vdr.py --input request.md --outdir ./vdr_out
```

PMの作業は次の2つだけに絞られる:

1. `request.md`（顧客要望・背景・データ等）を書く。**投入前に `00_data_policy.md` のレベル判定を行い、L3は匿名化する**
2. `turn3_integration.md` を読み、「PM最終判断」「判断理由」の2欄を自分で埋める（AIは意図的にこの2欄を書かない設計）

## 完全独立モード

`--independent` を付けると Turn 2 に Turn 1 の出力を見せない。アンカリングを完全排除したい重案件（安全・契約・証跡が重い案件）向け。通常はデフォルト（Turn 1参照あり）で十分。

## モデル選択

環境変数 `VDR_MODEL` で切替（デフォルト: claude-sonnet-4-6）。ルーティング指針:

- Turn 1〜2（発散・ロール別レビュー）: Sonnet系で十分
- 重案件のTurn 3（統合・判断材料化）だけ上位モデル、が費用対効果の分岐点

## 次の拡張候補（実案件1件を通してから判断）

- Root Cause Engine（master_prompt）の同様の自動化
- Turn 3出力から `pm_brain/cases/` テンプレートへの自動転記
- Claude Codeスキル化（`/vdr request.md` で起動）

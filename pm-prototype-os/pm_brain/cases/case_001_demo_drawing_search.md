---
case_id: "case_001"
client: "デモケース（顧客名なし）"
industry: "建築"
phase: "実施設計"
cause_category: ["Data", "Process"]
tech_category: ["RAG", "BIM/IFC"]
mvp_pattern: "Pattern A: Document Search MVP"
status: "MVP検証中"
poc_result: "未評価"
date: "2026-07-01"
---

# 図面検索リクエスト（デモケース）

> このケースは `virtual_design_review/example_drawing_search.md` の内容を、PM Brainの検索が実際に機能することを示すために最初の1件として登録したものです。実在の顧客案件ではありません。実案件が入り次第、デモケースとして残すか削除するか判断してください。

## 顧客発言

```text
図面をAIで検索したい。
```

## 表面的な要望

図面検索AIが欲しい。

## 本当の課題

- 図面の最新版が分からない
- 図面番号ルールが不統一
- 図面と仕様書が紐づいていない
- 議事録の変更が図面に反映されたか追えない

## 業務フロー

現行：フォルダ検索／個人の記憶に依存。理想：図面台帳＋版管理＋根拠付き検索。

## 要件

- PDF図面またはIFCモデルを入力し、最新版・更新日・承認状態を一覧管理する
- 図面テキスト・表題欄・関連仕様を検索可能にする

## MVP

1案件分の図面台帳＋版管理＋根拠付き検索の1画面プロトタイプ。

## 採用技術

```text
Next.js
shadcn/ui
mock drawing metadata
PDF text extraction mock
source evidence panel
```

## プロトタイプ

未着手（デモケースのため）。

## 顧客フィードバック

（デモケースのため記録なし）

## 成功/失敗

（デモケースのため未評価）

## 次案件に使える学び

- 「図面検索AIが欲しい」という発言は、ほぼ確実に版管理の崩れが背後にある。最初の切り分け質問は「探したいのは図面ファイルそのものか、図面内の情報か」が有効。
- 初期MVPはRAGより先にメタデータ構造化（版・更新日・承認状態）から始める方が安全。

## 関連ファイル

- 議事録: なし（デモ）
- 要件定義書: `virtual_design_review/example_drawing_search.md`
- プロトタイプ: なし

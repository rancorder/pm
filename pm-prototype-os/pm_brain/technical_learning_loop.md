# Technical Learning Loop

案件で得た技術知見を、偶然のメモから再利用可能な判断へ昇格する手順。

## 1. 案件内で記録

PM Brain案件ファイルへ次を残す。

- 採用したDecision ID
- 避けた構成
- 発生した症状
- 実際の原因
- 修正方法
- Golden Caseへ追加した事例
- Quality Gate結果

## 2. Candidate化

新しい知見はテンプレートからJSONを作り、`status: candidate`、Evidence E0/E1で登録する。

## 3. 最小検証

最小コード・サンプルで再現したらE2。再現できなければ`rejected`。

## 4. 実データ検証

実データで再現したらE3。案件固有条件と反証条件を必ず残す。

## 5. 別種類で反証

異なる出力元・書類タイプ・データ量で再検証する。1案件の成功だけで一般原則にしない。

## 6. OSへ昇格

- 人間向け説明：Tech Card
- 機械検索：Technical Decision JSON
- 動く構成：Starter
- 再発防止：Golden Case / test
- 顧客質問：ヒアリングテンプレ

## 7. 鮮度管理

`review_due`超過、依存ライブラリの保守停止、代替技術の登場、案件条件の変化があれば再検証する。

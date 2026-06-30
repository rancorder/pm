# Role Separation Protocol

`review_prompt.md`は7ロール＋統合を1回のプロンプトで生成させる設計だった。これは速いが、1つのモデルが1回の思考の中で「いかにも対立してそうな7意見」を作文してしまうリスクを構造的に抱えている。PM側は「複数視点でレビューした」という安心感を得るが、実際には自己対話のループに過ぎない可能性がある。

全7ロールを毎回独立させると遅く・コストも重くなるため、**最も対立しやすい2ロール（AI EngineerとRisk/Operations Reviewer）だけ**を別ターンで独立生成させる。

## 全体の流れ（3ターン構成）

```text
Turn 1: 5ロール一括生成
  Construction Domain Expert / Product Manager / Software Architect / UX Designer / Business Owner

Turn 2-A: AI Engineerを単独生成（Turn 1の出力は見せるが、Turn 2-Bの出力は見せない）

Turn 2-B: Risk / Operations Reviewerを単独生成（Turn 1の出力は見せるが、Turn 2-Aの出力は見せない）

Turn 3: 全7ロールの出力を提示した上でPMとして統合する
```

Turn 2-AとTurn 2-Bを互いに見せない状態で独立生成することで、「AIで自動化したい」という設計に対してAI Engineerが楽観的になりすぎず、Risk/Opsが事前にAI Engineerの結論に引っ張られて当たり障りのない懸念しか出さない、という両方の事故を防ぐ。

## Turn 1 プロンプト（5ロール一括）

```text
あなたたちは建設DXプロダクトのバーチャル設計レビュー委員会です。
以下の顧客要望を、5つの専門家ロールでレビューしてください。
AI EngineerとRisk/Operations Reviewerはこの後別途レビューするため、ここでは含めないでください。

# 入力
## 顧客要望
## 背景
## 現在業務
## 利用データ
## 利用中ツール
## 関係者
## 期待成果
## 現時点のMVP案

# ロール
1. Construction Domain Expert
2. Product Manager
3. Software Architect
4. UX Designer
5. Business Owner

# 各ロールの出力
- この要望の見え方
- 疑うべき真因
- 追加質問
- 推奨MVP
- 実装上の注意
- 反対意見/懸念
- 評価: S / A / B / C
```

## Turn 2-A プロンプト（AI Engineer単独）

```text
あなたはAI Engineerとして、以下の顧客要望をレビューしてください。
参考として、他5ロール（Construction Domain Expert / PM / Software Architect / UX / Business Owner）のレビュー結果も渡します。

# 入力
## 顧客要望（Turn 1と同じ）
## Turn 1の5ロールレビュー結果

# 出力（expert_roles.md の AI Engineer フォーマットに従う）
- この要望の見え方
- 疑うべき真因
- 追加質問
- 推奨MVP
- 実装上の注意
- 反対意見/懸念
- 評価: S / A / B / C

# 注意
- AIで解決できると安易に結論づけない
- 精度・根拠表示・評価方法・人間レビューの設計を必ず含める
```

## Turn 2-B プロンプト（Risk/Operations Reviewer単独）

```text
あなたはRisk / Operations Reviewerとして、以下の顧客要望をレビューしてください。
参考として、他5ロール（Construction Domain Expert / PM / Software Architect / UX / Business Owner）のレビュー結果も渡します。
AI Engineerのレビュー結果はまだ存在しないものとして、独立に判断してください。

# 入力
## 顧客要望（Turn 1と同じ）
## Turn 1の5ロールレビュー結果

# 出力（expert_roles.md の Risk/Operations Reviewer フォーマットに従う）
- この要望の見え方
- 疑うべき真因
- 追加質問
- 推奨MVP
- 実装上の注意
- 反対意見/懸念
- 評価: S / A / B / C

# 注意
- セキュリティ・権限・監査ログ・契約・品質・安全上の責任を必ず検討する
- 「AIが楽観的に見ている領域」を想定して、あえて悲観的な視点から検証する
```

## Turn 3 プロンプト（統合）

```text
以下の7ロールのレビュー結果を統合し、PMとして最終方針を出してください。
特に、AI EngineerとRisk/Operations Reviewerの評価が食い違っている場合は、
その対立点を conflict_resolution.md の対立パターンに当てはめて整理してください。

# 入力
## 顧客要望
## Construction Domain Expert（Turn 1）
## Product Manager（Turn 1）
## Software Architect（Turn 1）
## UX Designer（Turn 1）
## Business Owner（Turn 1）
## AI Engineer（Turn 2-A）
## Risk / Operations Reviewer（Turn 2-B）

# 統合出力（review_prompt.md の統合出力フォーマットに従う）
1. 真因候補ランキング
2. 最初に聞くべき質問
3. 採用すべきMVP
4. 採用しないMVPと理由
5. 推奨UIパターン
6. 推奨技術構成
7. PoC成功条件
8. 主要リスク
9. 今回やらないこと
10. Claude Code / Codex向け実装指示

# 追加: AI EngineerとRisk/Opsの対立点
## 対立点
## 各ロールの主張
## PM判断
## 理由
```

## いつこのプロトコルを使うか

| 状況 | 推奨方式 |
|---|---|
| 顧客要望の初動・規模が小さい | 旧来のワンショット（`review_prompt.md`）で十分 |
| AI活用が前提の要望（RAG/Agent/自動判定）| このプロトコル（3ターン）を使う |
| 安全・契約・証跡が重い要望（検査・契約・施工管理系）| このプロトコル（3ターン）を使う |
| 既に類似案件がPM Brainにあり、判断パターンが分かっている | 旧来のワンショットで十分。3ターンは初見の重い案件向け |

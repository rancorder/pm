# GPT / Claude Project Sources

GPTプロジェクトおよびClaudeプロジェクトに保存・添付するための情報源MD。

## 目的

このファイルは、PM Prototype OSをGPT/Claudeプロジェクトで再現するための参照リストです。

GPT/ClaudeにこのMDを読み込ませることで、以下を一貫して実行できるようにします。

- 顧客要望の深掘り
- 真因追求
- 要件定義
- MVP設計
- 技術選定
- プロトタイプ指示
- バーチャル設計レビュー
- Arent/建設DX文脈でのPM判断

---

# 1. プロジェクトの前提

## Project Name

PM Prototype OS

## Purpose

顧客ヒアリングから、真因追求・要件定義・MVP設計・技術探索・プロトタイプ作成までを超短時間化する。

## Target Context

- ArentでのエンジニアPM業務
- 建設DX
- BIM / Revit / IFC
- プラント設計
- 図面・仕様書・議事録RAG
- AI Agentによる業務支援
- 顧客要望からプロトタイプまでの高速化

## Core Philosophy

顧客の要望をそのまま作らない。

```text
顧客要望
↓
本当にそこが課題か疑う
↓
真因候補を出す
↓
深掘り質問で切り分ける
↓
要件定義
↓
MVP
↓
技術選定
↓
プロトタイプ指示
```

---

# 2. 最優先で読み込ませるファイル

GPT/Claudeプロジェクトでは、まず以下を優先して読み込ませる。

## Core

```text
pm-prototype-os/README.md
pm-prototype-os/01_customer_interview.md
pm-prototype-os/02_need_to_requirement.md
pm-prototype-os/03_mvp_scope.md
pm-prototype-os/04_prototype_prompt.md
pm-prototype-os/05_engineer_handoff.md
pm-prototype-os/06_arent_domain_questions.md
pm-prototype-os/08_ai_tool_routing.md
```

## Root Cause Engine

```text
pm-prototype-os/root_cause_engine/README.md
pm-prototype-os/root_cause_engine/root_cause_playbook.md
pm-prototype-os/root_cause_engine/hypothesis_scoring.md
pm-prototype-os/root_cause_engine/diagnostic_prompts.md
pm-prototype-os/root_cause_engine/solution_pattern_engine.md
pm-prototype-os/root_cause_engine/architecture_recommender.md
pm-prototype-os/root_cause_engine/master_prompt.md
pm-prototype-os/root_cause_engine/examples.md
```

## Virtual Design Review

```text
pm-prototype-os/virtual_design_review/README.md
pm-prototype-os/virtual_design_review/expert_roles.md
pm-prototype-os/virtual_design_review/review_prompt.md
pm-prototype-os/virtual_design_review/role_separation_protocol.md
pm-prototype-os/virtual_design_review/conflict_resolution.md
pm-prototype-os/virtual_design_review/final_decision_template.md
pm-prototype-os/virtual_design_review/example_drawing_search.md
```

---

# 3. 建設業ドメイン情報源

建設DX/BIM/Arent文脈で回答するために読み込ませる。

```text
pm-prototype-os/domain/construction_domain_map.md
pm-prototype-os/domain/construction_glossary.md
pm-prototype-os/domain/construction_standards.md
pm-prototype-os/domain/construction_pm_questions.md
pm-prototype-os/domain/construction_ai_opportunity_cards.md
pm-prototype-os/domain/construction_research_sources.md
pm-prototype-os/domain/arent_priority_domains.md
```

## 使いどころ

- 建設業務の理解
- BIM/Revit/IFC文脈の整理
- 顧客ヒアリング質問作成
- 建設業特有の真因候補抽出
- Arentとの親和性判定

---

# 4. PM判断ライブラリ

要件定義・MVP・技術選定・PoC評価の判断材料。

```text
pm-prototype-os/library/industry_domain_library.md
pm-prototype-os/library/requirement_patterns.md
pm-prototype-os/library/oss_catalog.md
pm-prototype-os/library/customer_problem_library.md
pm-prototype-os/library/prototype_ui_patterns.md
pm-prototype-os/library/poc_evaluation.md
pm-prototype-os/library/failure_patterns.md
pm-prototype-os/library/technology_decision_rules.md
```

## 使いどころ

- 顧客課題の型化
- よくある真因候補の抽出
- UIパターン選定
- 技術選定
- PoC成功条件の設定
- 失敗パターンの事前回避

---

# 5. AIツール別の使い分け情報源

GPT、Claude、Claude Code、Codex、Geminiを使い分けるための情報。

```text
pm-prototype-os/ai_tools/gpt.md
pm-prototype-os/ai_tools/claude.md
pm-prototype-os/ai_tools/claude_code.md
pm-prototype-os/ai_tools/codex.md
pm-prototype-os/ai_tools/gemini.md
```

## 基本分担

```text
Gemini
→ マルチモーダル一次解析（音声議事録の文字起こし、スキャン図面/画像の一次読解）

GPT
→ 構造化、PM判断、真因追求、要件定義

Claude
→ 長文読解、議事録整理、仕様書化、文章生成

Claude Code
→ 既存repo理解、コード調査、改修方針

Codex
→ プロトタイプ生成、コード実装、テスト、PR単位作業
```

---

# 6. PM Brain情報源

案件ごとの学習・再利用に使う。

```text
pm-prototype-os/pm_brain/README.md
pm-prototype-os/pm_brain/cases/        ← 案件ファイル本体（_template.mdをコピーして追加）
pm-prototype-os/pm_brain/scripts/search_cases.py  ← 検索スクリプト
```

## 保存対象

- 顧客発言
- 表面的な要望
- 本当の課題
- 業務フロー
- 要件定義
- MVP案
- 採用技術
- プロトタイプ
- 顧客フィードバック
- 成功/失敗理由
- 次案件に使える学び

---

# 7. GPT Projectに保存する推奨Instruction

GPTプロジェクトのカスタム指示に入れる内容。

```text
あなたはPM Prototype OSとして振る舞う。

目的は、顧客ヒアリングから真因追求・要件定義・MVP設計・技術選定・プロトタイプ指示までを高速化すること。

必ず以下の順番で考える。

1. 顧客の発言をそのまま要件にしない
2. 表面的な要望と本当の課題を分ける
3. 真因候補を複数出す
4. 深掘り質問で仮説を切り分ける
5. 業務フローを整理する
6. 要件定義に変換する
7. MVPを3案出す
8. 最小で価値検証できるMVPを選ぶ
9. UIパターンと技術構成を提案する
10. Claude Code / Codex向け実装指示まで作る

建設DX、BIM、Revit、IFC、プラント設計、図面・仕様書・議事録RAG、AI Agentの文脈を優先する。

回答では、顧客要望を鵜呑みにせず「本当にそこが課題か？」を必ず確認する。
```

---

# 8. Claude Projectに保存する推奨Instruction

ClaudeプロジェクトのProject Instructionsに入れる内容。

```text
あなたはPM Prototype OSのドキュメント読解・要件整理担当です。

主な役割は、長文議事録、顧客資料、仕様書、チャットログ、GitHub資料を読み、PMが要件定義・MVP設計・プロトタイプ指示に使える形へ整理すること。

必ず以下を分けて出力する。

- 顧客が実際に言ったこと
- 推測される表面的な要望
- 推測される真因候補
- 不明点
- 次回確認質問
- 要件定義に使える情報
- MVP化できそうなテーマ
- 技術調査候補

文章は読みやすく整えるが、顧客発言と推測を混ぜない。
不明なことは不明と書く。
技術的に未検証の内容は断定しない。
```

---

# 9. Claude Code / Codexへ渡す基本情報

実装系AIに渡すときは、以下を添える。

```text
このプロジェクトはPM Prototype OSです。
目的は、顧客確認用のプロトタイプを高速に作ることです。

本番実装ではなく、要件確認・MVP検証・顧客レビューを目的とします。

実装時の基本方針：
- ログイン不要
- DBはダミーでよい
- UIは業務システム風に簡潔
- 根拠表示と人間レビューを重視
- 過剰実装しない
- 今回やらないことを明示する
- 本番化時の残課題を最後に書く
```

---

# 10. 推奨読み込み順

## 最小セット

```text
1. README.md
2. root_cause_engine/master_prompt.md
3. virtual_design_review/review_prompt.md
4. domain/arent_priority_domains.md
5. library/requirement_patterns.md
6. library/prototype_ui_patterns.md
7. library/technology_decision_rules.md
```

## フルセット

```text
1. Core files
2. Root Cause Engine
3. Virtual Design Review
4. Construction Domain
5. PM Libraries
6. AI Tool Guides
7. PM Brain
```

---

# 11. 外部調査対象

必要に応じて、最新情報を調査する対象。

## BIM / IFC / OpenBIM

- IfcOpenShell
- BlenderBIM
- BIMROCKET
- IFC model checker
- IDS / Information Delivery Specification

## Construction AI / AECO

- Awesome-AECO
- DDC Skills for AI Agents in Construction
- OpenConstructionERP
- Construction RAG projects

## AI / Agent / RAG

- LangGraph
- LlamaIndex
- LangChain
- Haystack
- OpenAI Agents SDK
- MCP Servers

## Prototype / UI

- Next.js
- shadcn/ui
- React Flow
- Mermaid
- Playwright

---

# 12. 標準出力フォーマット

GPT/Claudeが回答するときは、可能な限り以下の順番で出す。

```text
## 顧客要望

## 表面的な要望

## 本当に疑うべき真因

## 真因候補ランキング

## 最初に聞くべき質問

## 回答パターン別の分岐

## 現行業務フロー

## 理想業務フロー

## 要件定義

## MVP候補3案

## 推奨MVP

## UIパターン

## 技術構成

## PoC成功条件

## リスク

## Claude Code / Codex向け実装指示
```

---

# 13. 重要な判断原則

```text
顧客の要望は答えではなく、症状である。

AI自動化より先に、業務構造とデータ状態を見る。

初期MVPは、自動化ではなく候補提示＋人間レビューを基本にする。

建設業では、根拠表示・証跡・責任分界を軽視しない。

プロトタイプは本番品質ではなく、顧客との認識合わせの道具である。

技術選定は、RAG / Rule / Agent / OCR / CV / BIM処理を目的別に分ける。

PoCの成功条件を事前に決める。
```

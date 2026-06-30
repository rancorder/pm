# Changelog

## v0.2（レビュー反映版）

レビューで指摘された「問題点」のうち、S優先度4件＋A優先度3件を修正。

### 致命的な設計課題の解消

- **リポジトリの二重人格問題**：PM Prototype OSと無関係な面接プレゼン（"Project Failure Simulator"）を `archive/interview-presentation-2025/` へ隔離。ルートに `README.md` を新設し、このリポジトリの主役がPM Prototype OSであることを明記。
- **PM Brainの空問題**：`pm_brain/cases/` に案件テンプレートと検索スクリプト（`scripts/search_cases.py`、外部ライブラリ不要）を追加。動作確認用の最初の1件（デモケース）も登録し、検索が実際に機能することを確認済み。
- **ゴール数値の矛盾**：README.mdの「2時間」とレビュー依頼文の「30分」を、30分（一次仮説）／2時間（実装着手）の2段階ゴールとして統一。
- **仮説スコアリングの穴**：Evidence（根拠）が低い仮説が合計点だけでSランクに届いてしまう問題に対し、フロア制約（Evidence<=2でB以下、Evidence<=1でC以下）を追加。実運用向けのQuick Scoreモード（コア4項目）も追加。

### A優先度の解消

- **Gemini不在**：`ai_tools/gemini.md`を新設し、マルチモーダル一次解析（音声議事録・スキャン図面）の役割を明文化。`08_ai_tool_routing.md`と`project_context/gpt_claude_project_sources.md`の使い分け表にも反映。
- **建設標準の欠落**：`domain/construction_standards.md`を新設し、ISO 19650 / CDE / BCF / COBie / Digital Twin / buildingSMART / Civil 3D / Navisworksを追加。`construction_glossary.md`から相互参照。
- **Virtual Design Reviewのワンショット問題**：`virtual_design_review/role_separation_protocol.md`を新設。AI EngineerとRisk/Operations Reviewerの2ロールだけを別ターンで独立生成させる3ターン構成のプロンプトを追加。

### 未着手（B/C優先度、次のイテレーションで対応）

- Tech Cardのスケール（現状3件→主要OSS10件程度へ）
- `08_ai_tool_routing.md`と`ai_tools/*.md`の役割分担表の重複統合
- `oss_catalog.md`と`construction_research_sources.md`の重複統合
- PoC評価とPM Brainの自動連携（現状は手動転記ルールの明文化のみ）
- web-ifc/Speckleを使った実働BIM MVPスターターテンプレート

## v0.1

初版。47件のMarkdownでRoot Cause Engine / Virtual Design Review / 建設ドメイン知識 / OSSカタログ / PM Brain（テンプレートのみ）/ AIツールルーティング（Gemini除く）を構築。

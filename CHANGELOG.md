# Changelog

## v0.5.1（外部知見の継続ウォッチ台帳）

Qiita/Zenn/技術ブログ/公式ドキュメント等から拾った外部知見を、検証ステータス付きで管理する仕組みを追加。凍結ルールとの整合のため、外部記事は原則すべて「未検証」で登録し、実案件で当ててから効いた差分だけを該当モジュールへ昇格させる規律にした。

### 新規
- `library/external_watch_log.md`: 外部知見の継続ウォッチ台帳。検証ステータス（未検証/検証予定/採用/棄却）＋昇格ルール＋定期ウォッチ情報源リスト
  - doc-to-data系: 文書グラウンディング(PyMuPDF)、国産LLM llm-jp-4のJSON抽出精度、構造化データ×RDB
  - 建設DX系: IFC→RDFグラフ+text-to-SPARQL、Ishigaki-IDS(GENIAC)、LLMはIFC直読不可の現実解
  - AI駆動開発系: Claude Code ReviewのCI/CD組込み、vault環境変数によるキー分離

### 編集
- `domain/construction_research_sources.md`: 外部ウォッチ台帳への導線を追記

### 位置づけ
このファイルは「検証待ちの入口」であり「確定知見の置き場」ではない。採用済みは各モジュール（cards/domain/library/starters）へ昇格し、台帳からは索引だけ残す運用。

## v0.5（doc-to-dataパターン：実測との差分で書く）

v0.4で宣言した方針「v0.5は追加ではなく実測との差分で書く」に従い、doc-to-dataパイプラインを実データ2種（電気工事の積算書A系・供給者見積もりB系を模したダミー）で検証し、そこで判明した差分だけを反映した。日々総合設備案件（NTT定型書類の自動作成）への備え。

### 新規
- `cards/doc_to_data.md`: 書類→AI抽出→正準データ→転記の共通パターンカード。実測で確定した6原則
- `starters/doc-to-data/`: 設計・検証キット一式（2層スキーマ・検算スクリプト・A/Bサンプル・抽出結果）
  - `schema_v0.md`（単層・破綻の記録として保存）→ `schema_v0_1.md`（共通コア＋タイプ別プロファイルの2層）
  - `verify.py`: 決定論的検算層（明細検算・省略検出・HITL対象抽出）

### 実測で確定した知見（頭の設計では気づけなかった差分）
- **正準スキーマは単層では破綻**：A系スキーマにB系を乗せたら15フィールド中6がnull・10が意味ズレ。共通コア＋タイプ別プロファイルの2層へ
- **勝ち筋は賢い抽出でなく後段の決定論的検算層**：明細が全量でない事実を捕まえたのはAIでなくPython検算（多段推論ほど確度は落ちる）
- **役割語は書類の立場で意味が反転**：contractorはA系で受注者、B系で見積の宛先。self_role（自社から見た立場）を明示フィールド化
- **1書類だけの検証は隠れ前提を残す**：A系だけでは割引/マイナス行が一度も検査されない。種類の違う2つ目を必ず通す
- **転記物は完成書類でなく要確認フラグ付きドラフト**：岡島マネージャーの言う「記入漏れ確認」はこのフラグ層

### calibration_log
- 検証2本を実績として記録（#1 三層成立=○ / #2 単層スキーマ=×）

### 未着手（8月・実データフェーズ）
- 実NTT書類/実プラネスト見積もりで2層スキーマを再検証
- ContextGem（github.com/shcherbak-ai/contextgem）/ Unstract を実データで評価し選定カードへ追記
- doc-to-dataのオーケストレーション自動化（run_vdr.py と同型）

## v0.4（実運用レビュー反映：実行レイヤー・データポリシー・キャリブレーション）

レビュー指摘のS優先度3件＋A優先度3件を反映。方針として「Markdownの追加」は最小限に絞り、実行・検証・安全の3レイヤーに限定した。

### S優先度の解消

- **実行レイヤーの新設**：`orchestration/run_vdr.py`（標準ライブラリのみ）でVDR 3ターンを1コマンド自動実行。PMの作業を「入力準備」と「Turn 3後の最終判断記入」の2つに限定。完全独立モード（`--independent`）も実装
- **データ取り扱いポリシー新設**：`00_data_policy.md`。L1/L2/L3の3段階分類×AIツールのマトリクス、匿名化ルール、顧客説明用テンプレ。OSの全ファイルより優先と明記
- **Evidence引用強制**：`master_prompt.md`と`hypothesis_scoring.md`に「Evidence>=3は直接引用必須、引用なしは2点扱い（＝フロア制約でB以下）」「反証条件が書けない仮説はC」を追加。AIの自己申告スコアが見た目の説得力を持つ問題への対処

### A優先度の解消

- **キャリブレーション開始基準の変更**：`pm_brain/calibration_log.md`を新設し、評価ループを「10件超えたら」から「1案件目から」に前倒し。S/A/B/C閾値（32/25/18）を未検証の仮置き値と明記
- **三現主義ステップ**：`root_cause_playbook.md`にStep 3.5（現物確認）を追加。AI生成仮説をスコアリング前に現場・現物・現実で確認する。Contract/Rule切り分けの建設固有注意も追記
- **IFCスターターの境界線明文化**：web-ifc-viewerのメンテ終了状況、〜50MBのデモ上限、本番はThatOpen/IfcOpenShellへ乗り換え前提、属性チェックはIDS準拠（ifctester）へ寄せる方針をREADMEに追記

### その他

- **VDR Turn 3の禁則**：「PM最終判断」「判断理由」はAIに書かせず空欄で出させるルールを`role_separation_protocol.md`とスクリプト両方に実装（PM判断の形骸化防止）
- **Tech Cardテンプレに鮮度欄追加**：最終確認日・メンテ状況・後継の3項目（カードは腐る前提の運用へ）
- **デモ台本の新設**：`library/demo_playbook.md`。顧客データで始める・できないことを先に言う・デモ中の質問は要件、の3原則と15分進行テンプレ

### 未着手（次のイテレーション。ただしv0.5は「追加」ではなく「実測との差分」で書く）

- 実案件1件のエンドツーエンド実走と30分/2時間ゴールの実測 ← 最優先。これをやるまで他の追加は凍結
- doc-search starter（Pattern A）の実装
- Root Cause Engineの自動実行（run_vdr.py と同型）
- oss_catalog / cards / research_sources の3層→2層統合
- 5ツール分担→3系統への縮約実験

## v0.3（公開OSSのエッセンス組み込み）

「web-ifc/Speckleを使った実働BIM MVPスターター」を含む、B優先度の一部に着手。

- **`starters/ifc-mvp/` を新設**：web-ifc-viewer（MIT）を使った、実際に動くIFC MVP。`npm install && npm run build`、`tsc --noEmit`、ヘッドレスブラウザでの実IFCファイル読み込みテスト（壁/ドア/窓の検出、属性取得、属性欠損候補の自動検出）まで検証済み。依存バージョンの既知の詰まりポイント（`three`のpeer dependency不整合）も解消・文書化済み。
- **Tech Card追加**：`cards/speckle_version_control.md`（Speckle、Apache 2.0）、`cards/ids_validation.md`（buildingSMART公式IDS）を追加。`cards/ifc_analysis.md`から`starters/ifc-mvp/`へリンク。
- **`pm_brain/architecture_reference.md`を新設**：公開されているPM向けメモリシステムOSSの設計思想（決定論的スキャフォールド＋適応的プロンプトの分離、Migrationは進行中案件のみ、評価ループの必要性）を、コード・文章を引用せず一般化して記録。v0.2の`pm_brain`最小実装の設計根拠として接続。
- **`library/oss_catalog.md`のBIM/IFCセクションを更新**：web-ifc-viewer / Speckle / IDS toolsを具体名で追加。
- **重複解消**：`project_context/gpt_claude_project_sources.md`のAI役割分担表を`08_ai_tool_routing.md`への参照に簡略化。
- **PoC評価とPM Brainの連携を明文化**：`library/poc_evaluation.md`のGo/No-Go結果と、`pm_brain`案件ファイルの`poc_result`frontmatterの対応表を追加。

### 注記：非公開の他プロジェクトについて

別途検討した「Arentの採用選考課題として作成した非公開リポジトリ」からのパターン抽出は、非公開指定の意図（同一課題が今後の候補者にも使われる可能性）を尊重し、見送った。公開OSS（本バージョンで組み込んだweb-ifc-viewer、Speckle等）と非公開の課題成果物は明確に扱いを分けている。

### 未着手（次のイテレーション）

- Tech Cardのさらなるスケール（現状5件）
- Speckle/IDSを実際に動くコードとして統合（現状はTech Cardのみ）

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

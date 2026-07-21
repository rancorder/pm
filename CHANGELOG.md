# Changelog

## v0.6（Technical Decision OS / MVP Factory）

要件定義・MVP設計中心だったPM Prototype OSへ、技術判断と完成判定の実行レイヤーを追加。技術名の一覧ではなく「条件→採用/非採用→相性→失敗症状→移行条件」をJSON知識として管理し、MVP Contract・Golden Dataset・自動品質ゲートから参照できるようにした。

### 新規：Technical Decision OS

- `technical_decision_os/README.md`
- 5種類の知識：Decision / Compatibility / Failure / Benchmark / Migration
- Evidence Level E0〜E5、confidence、最終検証日、再検証期限
- JSON Schemaと5種類のテンプレート
- `validate_knowledge.py`：構文・ID重複・Evidence・鮮度・参照整合を検証
- `search_knowledge.py`：kind / domain / status / Evidence / keyword検索
- 初期知識を実測済み内容から登録
  - `DEC-DOC-001`：共通コア＋タイプ別プロファイル
  - `DEC-DOC-002`：AI抽出後段の決定論的検算
  - `COMP-IFC-001`：web-ifc-viewer系とthreeの依存制約
  - `FAIL-DOC-001`：単一スキーマのnull・意味ズレ
  - `MIG-IFC-001`：IFC PoC構成から本番構成への移行境界

### 新規：MVP Factory

- `mvp_factory/contracts/`：Executable MVP Contract
- `mvp_factory/evals/`：Golden Case Schema
- `mvp_factory/quality/`：Definition of Done / Risk Budget / Demo Readiness
- `verify_mvp.py`：Contract、Technical Decision参照、Golden Dataset、成果物、品質コマンドを一括検証しJSONレポート化
- Live / Replay / Mockの3モードを標準化
- Pass / Pivot / Kill条件をContract必須化

### PM Brain・既存OS統合

- 案件frontmatterへDecision / Compatibility / Failure / Benchmark / Migration IDを追加
- MVP Contract / Quality Report / Evidence Levelを案件検索可能に変更
- `search_cases.py`へ技術判断ID・Evidence・PoC結果フィルタを追加
- `technical_learning_loop.md`を新設
- `03_mvp_scope.md`、`04_prototype_prompt.md`、`05_engineer_handoff.md`をContract・Golden Dataset・Technical Decision前提へ刷新
- Tech Card Templateをv2化し、When to use / not to use / 相性 / 失敗 / 移行 / Evidence / 鮮度を追加
- IFC / Construction RAGカードをv2へ更新
- PoC評価をQuality Gate・技術知識昇格・棄却記録へ接続

### CI / 品質

- `pm-prototype-os/scripts/verify_os.py`を新設
- `.github/workflows/pm-prototype-os-quality.yml`を追加
- PR時にJSON構文、Python構文、Technical Knowledge整合を自動検証

### 重要な設計変更

- Tech Cardは人間向け説明、Technical Decision JSONは機械検索・参照の正本
- E0/E1を標準採用しない
- 成功知識よりFailure Cardを先に検索
- PoC構成と本番構成をMigration Ruleで分離
- 「画面が動く」ではなく、ContractとQuality Gateで完成判定する

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
- ContextGem / Unstractを実データで評価し選定カードへ追記
- doc-to-dataのオーケストレーション自動化（run_vdr.pyと同型）

## v0.4（実運用レビュー反映：実行レイヤー・データポリシー・キャリブレーション）

レビュー指摘のS優先度3件＋A優先度3件を反映。方針として「Markdownの追加」は最小限に絞り、実行・検証・安全の3レイヤーに限定した。

### S優先度の解消
- **実行レイヤーの新設**：`orchestration/run_vdr.py`でVDR 3ターンを1コマンド自動実行
- **データ取り扱いポリシー新設**：`00_data_policy.md`。L1/L2/L3分類・匿名化・顧客説明
- **Evidence引用強制**：Evidence>=3は直接引用必須、引用なしは2点扱い

### A優先度の解消
- **キャリブレーション開始基準の変更**：`pm_brain/calibration_log.md`を新設し1案件目から評価
- **三現主義ステップ**：`root_cause_playbook.md`へ現物確認を追加
- **IFCスターターの境界線明文化**：デモ上限、本番の後継、IDS準拠方針

### その他
- VDR Turn 3のPM最終判断をAIに書かせない
- Tech Cardテンプレに鮮度欄追加
- `library/demo_playbook.md`を新設

### 未着手
- 実案件1件のエンドツーエンド実走と30分/2時間ゴールの実測
- doc-search starter
- Root Cause Engineの自動実行
- OSS情報層の統合
- AIツール分担の縮約実験

## v0.3（公開OSSのエッセンス組み込み）

- `starters/ifc-mvp/`を新設。実IFC読み込み・属性欠損候補まで検証
- Speckle / IDS Tech Cardを追加
- `pm_brain/architecture_reference.md`を新設
- `library/oss_catalog.md`を更新
- AI役割分担の重複を解消
- PoC評価とPM Brainの連携を明文化

### 注記：非公開の他プロジェクトについて

非公開指定の採用選考課題成果物からのパターン抽出は見送り、公開OSSと明確に分離した。

### 未着手
- Tech Cardのさらなるスケール
- Speckle / IDSの実働コード統合

## v0.2（レビュー反映版）

- 面接プレゼンを`archive/`へ隔離し、リポジトリの主役を明確化
- PM Brainへ案件テンプレート・検索スクリプト・デモケースを追加
- 30分一次仮説 / 2時間実装着手へゴールを統一
- Evidenceフロア制約とQuick Scoreを追加
- Geminiの役割を追加
- 建設標準を追加
- Virtual Design Reviewのロール分離を追加

### 未着手
- Tech Cardのスケール
- AIツール役割表の統合
- OSSカタログの統合
- PoC評価とPM Brainの自動連携
- 実働BIM Starter

## v0.1

初版。47件のMarkdownでRoot Cause Engine / Virtual Design Review / 建設ドメイン知識 / OSSカタログ / PM Brain / AIツールルーティングを構築。

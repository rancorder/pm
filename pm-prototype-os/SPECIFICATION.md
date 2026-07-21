# PM Prototype OS 仕様書

Version: 0.6.1  
Status: Draft PR implementation  
Scope: `pm-prototype-os/`

## 1. 目的

PM Prototype OSは、顧客の曖昧な発言や現物データから、真因仮説、技術判断、検証可能なMVP、実装、品質検証、学習回収までを一気通貫で行うためのPM実行OSである。

本OSの目的は、文章作成の高速化ではない。次の2つを同時に実現することである。

1. **外しにくさ**：顧客発言を鵜呑みにせず、Evidenceに基づいて真因とMVPを選ぶ。
2. **作り切る速さ**：既知の技術判断、Starter、MVP Contract、自動品質ゲートを使い、再現可能な形で顧客提示まで進める。

標準フロー：

```text
顧客発言・現物
↓
Data / Process / Tool / People / Rule / Organization / Contract / Cost
↓
Evidence付き真因仮説
↓
MVP候補3案・推奨MVP
↓
Technical Decision OS
↓
Executable MVP Contract
↓
Starter / AI実装
↓
Golden Dataset・Quality Gate
↓
Live / Replay / Mockデモ
↓
Pass / Pivot / Kill
↓
PM Brain・技術知識へ学習回収
```

## 2. 適用範囲

### 2.1 主対象

- 建設DX
- BIM / Revit / IFC / OpenBIM
- プラント・設備・施工・設計支援
- 図面、仕様書、議事録、見積、契約等のDoc-to-Data
- RAG、検索、AI Agent、ルールチェック
- 顧客確認用Webプロトタイプ
- 業務フロー改善・アップセル／クロスセル仮説検証

### 2.2 対象外

- 本番SLA、運用監視、権限、監査等を省略したまま本番利用すること
- Evidenceなしの技術断定
- L3機密データの無条件なクラウドAI投入
- 顧客発言をそのまま機能要件へ変換すること
- AIにPM最終判断と責任を代行させること

## 3. 優先順位と正本

判断が競合する場合、次の順に優先する。

1. 所属組織・顧客契約・法令・セキュリティポリシー
2. `00_data_policy.md`
3. 本仕様書 `SPECIFICATION.md`
4. 現在の顧客一次情報・現物・顧客原文
5. 案件固有のMVP Contract
6. Technical Decision OSの有効な知識
7. PM Brainの類似案件
8. Tech Card、Library、一般的なAI知識

情報源のEvidence序列：

```text
現物 > 顧客原文 > 実際の業務フロー > 社内メモ > AI要約 > AI推測
```

AI要約・外部記事・未検証知識は、正本ではなく候補生成に使う。

## 4. ユーザーとAIの権限分離

### 4.1 AIが担当する

- 一次情報の整理と引用抽出
- 真因仮説の複数生成
- 仮説のEvidence・反証条件整理
- MVP候補と成功条件の設計
- 技術判断知識の検索・比較
- Compatibility・Failure・Migrationの検査
- MVP Contract、Golden Case、実装指示の下書き
- コード実装、テスト、PR、品質レポート
- PoC結果から学習候補を抽出

### 4.2 人間が担当する

- 最終的にどの仮説へ賭けるか
- 顧客に見せる範囲と捨てる範囲
- 契約・安全・責任を伴う判断
- Pass / Pivot / Killの最終判断
- 本番化可否
- Evidence昇格の承認

AIは「PM最終判断」「判断理由」を勝手に確定しない。必要な場合は空欄または`人間判断待ち`とする。

## 5. 動作モード

依頼内容に応じて必要なモードだけを選ぶ。単純な依頼に全工程を強制しない。

| Mode | 使用場面 | 主成果物 |
|---|---|---|
| Triage | 情報が断片的、まず状況把握 | 情報源、欠損、次アクション |
| Discovery | ヒアリング・商談ログ分析 | 重要引用、8カテゴリ真因、質問 |
| Requirement | 要件化 | 現行/理想フロー、要件、非要件 |
| Technical Decision | 技術選定 | 採用/非採用、相性、失敗、移行 |
| MVP Design | MVPを切る | 3案、推奨案、Contract初版 |
| Build | 実装 | 動作コード、テスト、PR |
| Review | 設計・コード・PoCレビュー | リスク、差分、Go/No-Go材料 |
| Learning | 結果回収 | PM Brain、Failure/Decision候補 |

複合案件では次の順を基本とする。

```text
Triage → Discovery → Requirement → Technical Decision → MVP Design → Build → Review → Learning
```

## 6. 入力仕様

最低限、利用できる範囲で以下を収集する。未提供項目を勝手に事実化しない。

```yaml
data_level: L1 | L2 | L3
customer_statement: 顧客原文
background: 背景
industry_domain: 業界・工程・業務領域
current_workflow: 現行業務
current_tools: 利用中ツール
input_data: ファイル形式・件数・品質・サンプル
stakeholders: 入力者・利用者・承認者・決裁者
expected_outcome: 期待成果
constraints: 納期・費用・環境・契約・セキュリティ
available_evidence: 現物・ログ・引用・計測値
```

### 6.1 データ分類

- L1：公開情報
- L2：案件を特定し得る社内情報。必要に応じ匿名化
- L3：NDA、図面、契約、原価、個人情報等。組織ルール・同意・処理環境を先に確認

L3生データはGitHubへ保存しない。PM BrainにはL2までの要約・判断ログのみ保存する。

## 7. 真因分析仕様

顧客発言は要件ではなく症状として扱う。必ず以下の8カテゴリを確認する。

- Data
- Process
- Tool
- People
- Rule
- Organization
- Contract
- Cost

各有力仮説には最低限、以下を付ける。

```yaml
hypothesis: 仮説
category: 8カテゴリのいずれか
evidence: 引用・現物・計測値
evidence_strength: S | A | B | C
counter_evidence: 反証または反証条件
impact: 影響
next_question: 切り分け質問
mvp_testability: MVPで検証可能か
```

### 7.1 Evidence制約

- 引用または現物がない仮説は、強い確定事項として扱わない。
- Evidenceの直接引用が必要な場面では、引用なしの自己申告スコアを認めない。
- 反証条件を書けない仮説は優先度を下げる。
- 単一真因に早期固定しない。

## 8. Technical Decision OS仕様

技術知識は製品紹介ではなく、**条件→判断→理由→失敗症状→切替条件**として保存する。

### 8.1 知識タイプ

- `decision`：条件付き採用・非採用
- `compatibility`：組合せとバージョン制約
- `failure`：症状、根本原因、診断、予防
- `benchmark`：比較実験
- `migration`：PoCから本番への移行条件

### 8.2 Evidence Level

| Level | 定義 | 利用可能範囲 |
|---|---|---|
| E0 | 未検証仮説 | 候補生成のみ |
| E1 | 公式情報確認 | 調査候補 |
| E2 | 最小コードで確認 | PoC候補 |
| E3 | 実データ確認 | 条件一致時のMVP標準候補 |
| E4 | 顧客デモ確認 | 類似案件へ再利用可能 |
| E5 | 本番継続確認 | 組織標準候補 |

### 8.3 技術判断順序

```text
1. Failure Cardを先に検索
2. Decision Ruleで候補を絞る
3. Compatibility Ruleで構成を検査
4. Migration RuleでPoCと本番を分離
5. Evidenceと鮮度を確認
6. MVP Contractへ判断IDを記録
```

知識が存在しない場合はIDを捏造せず、`candidate`として新規知識案を作る。

## 9. MVP Factory仕様

MVPは最小機能ではなく、最小検証単位である。

### 9.1 MVP分類

- Demo MVP：操作・理解・期待値を検証
- Data MVP：実データで精度・速度・欠損を検証
- Workflow MVP：入力者、承認者、出力先、修正ループを検証

### 9.2 Executable MVP Contract必須項目

- 検証仮説
- 対象ユーザー・判断者
- 入力データ
- 実行シナリオ
- 期待結果
- 成功しきい値
- 失敗条件
- Pass / Pivot / Kill
- 今回やらないこと
- Technical Decision ID
- Golden Case参照
- 必須検証コマンド
- デモモード

### 9.3 完成条件

次を満たさないものを「完成」と呼ばない。

- Contract必須項目が埋まっている
- 参照するTechnical Decision IDが存在する
- Golden Datasetがある
- 必須Quality Gateが成功している
- ReplayまたはMockがある
- 失敗時の表示・復旧方法がある
- Pass / Pivot / Kill基準がある

## 10. 実装仕様

### 10.1 基本原則

- 既存Starterを0→60の開始地点として優先する。
- 標準構成を変更する場合、変更理由と代替案を記録する。
- AI出力の後段には、可能な限り決定論的検証を置く。
- 本番級の過剰実装を避けるが、重大リスクは捨てない。
- 根拠表示、判定不能、エラー状態、空状態を設計する。
- Liveだけに依存せずReplay / Mockを用意する。

### 10.2 品質ゲート

案件に応じて以下を実行する。

```text
typecheck
lint
unit test
integration test
E2E smoke test
Golden Dataset eval
build
dependency / license check
OS knowledge validation
```

OS自体の検証：

```bash
python3 pm-prototype-os/scripts/verify_os.py
```

MVP検証：

```bash
python3 pm-prototype-os/mvp_factory/scripts/verify_mvp.py \
  --contract path/to/mvp_contract.json \
  --project-root path/to/project
```

Quality Gate失敗を説明だけで握りつぶさない。未実行・失敗・環境制約を分けて報告する。

## 11. レビュー仕様

AI、契約、検査、安全、監査、責任が重い案件では、楽観側と悲観側を独立させる。

- AI Engineer：実現性、精度、評価、コスト
- Risk / Operations Reviewer：セキュリティ、権限、監査、契約、責任、運用

両者を互いの結論に引っ張らせず、最後にPM向け対立点として統合する。

## 12. 標準成果物

依頼に応じて必要なものだけを出す。

### 12.1 Discovery標準

1. 表面的な要望
2. 重要引用
3. 8カテゴリ真因分析
4. Evidenceの強さ
5. 次回質問
6. MVP候補3案
7. 推奨MVP
8. 今回やらないこと
9. リスク
10. 次回商談ベストプラクティス

### 12.2 Technical Decision標準

1. 案件条件
2. 推奨構成
3. 非推奨構成
4. Compatibility
5. Known Failure
6. PoC構成
7. 本番構成
8. 移行トリガー
9. Evidence Level / Confidence / 鮮度
10. 未確認事項

### 12.3 Build標準

1. 変更内容
2. 変更理由
3. 対象ファイル
4. 実行した検証
5. 結果
6. 残存リスク
7. PR状態

## 13. 保存仕様

| 情報 | 保存先 |
|---|---|
| 顧客生データ、図面、契約 | Drive等の一次情報置き場 |
| 案件要約、仮説、PoC結果 | `pm_brain/cases/` |
| 人間向け技術説明 | `cards/` |
| 機械検索する判断知識 | `technical_decision_os/knowledge/` |
| 完成条件 | 案件の`mvp_contract.json` |
| 正解ケース | 案件のGolden Dataset |
| 品質結果 | `*.quality-report.json` |

## 14. 学習回収仕様

PoC・デモ・本番結果は、その場で消費しない。

```text
案件結果
↓
期待との差分
↓
次案件に使える条件付き学び
↓
Decision / Compatibility / Failure / Benchmark / Migration候補
↓
Evidence審査
↓
昇格・継続検証・棄却
```

昇格ルール：

- 外部記事だけ：E1候補
- 最小コード確認：E2
- 実データ確認：E3
- 顧客デモ確認：E4
- 本番継続確認：E5

失敗知識は削除せず、症状・原因・修正・予防テストを残す。案件固有の偶然を一般原則へ昇格させない。

## 15. GitHub運用仕様

- mainへ直接pushしない
- 作業ブランチを使用する
- 差分と対象範囲を確認する
- 関係ない変更を混ぜない
- テスト・品質ゲートを実行する
- PRを作成する
- ユーザーが明示しない限りマージしない
- APIキー、L3データ、生成キャッシュをコミットしない

## 16. 非機能要件

### 16.1 Traceability

顧客引用、仮説、Technical Decision ID、Contract、テスト、PoC結果が追跡可能であること。

### 16.2 Reproducibility

別のPM・AIが同じ入力から、判断理由と検証手順を再現できること。

### 16.3 Safety

データポリシー、契約、安全、責任上の制約が速度より優先されること。

### 16.4 Freshness

技術知識には確認日・再検証期限を持たせ、古い知識を自動的に確定事項として使わないこと。

### 16.5 Minimum Complexity

小規模案件に過剰なエージェント、Vector DB、本番級基盤を導入しないこと。

## 17. 受入基準

本OSが効果的に動作している状態は次の通り。

- 顧客原文とAI推測が分離される
- 有力仮説にEvidenceと反証条件がある
- MVPが検証仮説へ直接接続する
- 技術選定に採用条件・非採用条件がある
- 相性・失敗症状・移行条件が確認される
- ContractとGolden Datasetが品質判定に使われる
- デモ事故にReplay / Mockで備える
- PoC結果がPM Brainと技術知識へ戻る
- AIがPM最終判断を代行しない
- 実行した検証と未検証項目が明確である

## 18. 主要参照ファイル

- `00_data_policy.md`
- `01_customer_interview.md`
- `02_need_to_requirement.md`
- `03_mvp_scope.md`
- `04_prototype_prompt.md`
- `05_engineer_handoff.md`
- `08_ai_tool_routing.md`
- `root_cause_engine/master_prompt.md`
- `virtual_design_review/role_separation_protocol.md`
- `technical_decision_os/README.md`
- `mvp_factory/README.md`
- `library/poc_evaluation.md`
- `pm_brain/technical_learning_loop.md`
- `project_context/project_instruction_prompt.md`

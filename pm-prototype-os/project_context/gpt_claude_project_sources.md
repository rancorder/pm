# GPT / Claude Project Sources

PM Prototype OSをAIプロジェクトで再現するための正本・参照順・役割分担を示す索引。

## 正本

プロジェクト指示へ貼る文章の正本：

```text
pm-prototype-os/project_context/project_instruction_prompt.md
```

OS全体仕様の正本：

```text
pm-prototype-os/SPECIFICATION.md
```

データ取り扱いは、常に次が最優先：

```text
pm-prototype-os/00_data_policy.md
```

過去版の短いInstructionをコピーして使わず、上記の最新版を使用する。

## 最小読み込みセット

```text
pm-prototype-os/00_data_policy.md
pm-prototype-os/SPECIFICATION.md
pm-prototype-os/README.md
pm-prototype-os/project_context/project_instruction_prompt.md
pm-prototype-os/root_cause_engine/master_prompt.md
pm-prototype-os/technical_decision_os/README.md
pm-prototype-os/mvp_factory/README.md
pm-prototype-os/library/poc_evaluation.md
```

## 依頼別の追加参照

### 顧客ヒアリング・真因分析

```text
pm-prototype-os/01_customer_interview.md
pm-prototype-os/02_need_to_requirement.md
pm-prototype-os/root_cause_engine/
pm-prototype-os/virtual_design_review/
```

### 技術判断

```text
pm-prototype-os/technical_decision_os/README.md
pm-prototype-os/technical_decision_os/knowledge/
pm-prototype-os/cards/
pm-prototype-os/library/oss_catalog.md
pm-prototype-os/library/external_watch_log.md
```

検索例：

```bash
python3 pm-prototype-os/technical_decision_os/scripts/search_knowledge.py --keyword IFC
python3 pm-prototype-os/technical_decision_os/scripts/search_knowledge.py --kind failure --domain BIM
```

### MVP設計・実装

```text
pm-prototype-os/03_mvp_scope.md
pm-prototype-os/04_prototype_prompt.md
pm-prototype-os/05_engineer_handoff.md
pm-prototype-os/mvp_factory/
pm-prototype-os/starters/
```

### 建設DX固有知識

```text
pm-prototype-os/domain/
pm-prototype-os/06_arent_domain_questions.md
```

### 案件横断の学習

```text
pm-prototype-os/pm_brain/README.md
pm-prototype-os/pm_brain/cases/
pm-prototype-os/pm_brain/technical_learning_loop.md
```

## AIツールの役割

正本は`pm-prototype-os/08_ai_tool_routing.md`。

- GPT：構造化、真因、PM判断材料、技術判断、次アクション
- Claude：長文資料読解、仕様書化、文章化
- Gemini：音声、画像、スキャンPDF等の一次解析
- Claude Code：既存repo理解、修正、原因追跡
- Codex：プロトタイプ実装、テスト、PR

同じ仕事を複数AIへ重複させるのではなく、独立レビューが必要な箇所だけ分離する。

## 情報の保存先

| 情報 | 保存先 |
|---|---|
| 顧客生データ・図面・契約 | Drive等の一次情報置き場 |
| 案件要約・仮説・PoC結果 | `pm_brain/cases/` |
| 人間向け技術説明 | `cards/` |
| 機械検索する技術判断 | `technical_decision_os/knowledge/` |
| MVP完成条件 | 案件の`mvp_contract.json` |
| Golden Case | 案件のGolden Dataset |
| 品質結果 | `*.quality-report.json` |

## 検証

OS変更後：

```bash
python3 pm-prototype-os/scripts/verify_os.py
```

MVP作成後：

```bash
python3 pm-prototype-os/mvp_factory/scripts/verify_mvp.py \
  --contract path/to/mvp_contract.json \
  --project-root path/to/project
```

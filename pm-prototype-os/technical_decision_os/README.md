# Technical Decision OS

PM Prototype OSで扱う技術知見を、単なる「技術カタログ」ではなく、**条件付きの意思決定ルール**として保存・検索・検証するレイヤー。

## 解決する問題

従来のTech Cardは「何ができるか」「注意点」までは残せるが、次の判断を再利用しにくかった。

- どの条件なら採用するか
- どの条件なら採用しないか
- 何と何の組み合わせが危険か
- どんな症状が出たら設計ミスを疑うか
- PoC構成から本番構成へ、いつ切り替えるか
- その判断は推測か、実データ検証済みか

Technical Decision OSは、これらをJSONで固定し、MVP契約・PM Brain・PoC評価から参照できるようにする。

## 5種類の知識

| kind | 役割 | 代表的な問い |
|---|---|---|
| `decision` | 技術選択ルール | この条件なら何を選ぶか |
| `compatibility` | 組み合わせ制約 | AとBを組み合わせてよいか |
| `failure` | 失敗・地雷 | この症状の根本原因は何か |
| `benchmark` | 比較実験 | 候補A/B/Cの実測差は何か |
| `migration` | 段階移行 | PoCから本番へいつ切り替えるか |

## 情報の強さ

技術判断には必ずEvidence Levelを付ける。

| Level | 定義 | 標準利用 |
|---|---|---|
| E0 | AI・人間の未検証仮説 | 候補生成のみ。推奨に使わない |
| E1 | 公式Docs・Issue・公開仕様で確認 | 調査候補。環境差に注意 |
| E2 | サンプルコード・最小構成で動作確認 | PoC候補として利用可 |
| E3 | 実データで検証 | 同条件のMVPで標準候補にできる |
| E4 | 顧客デモで価値・動作を確認 | 類似案件へ再利用しやすい |
| E5 | 本番運用で継続確認 | 組織標準候補。ただし鮮度確認は継続 |

### 推奨強度ルール

- E0/E1だけの知識を「標準採用」にしない
- E2はPoC候補、E3以上は条件一致時の標準候補
- `review_due`を過ぎた知識は、Evidenceが強くても再確認する
- 成功知識より、失敗症状・非採用条件を先に検索する
- 条件が一致しない知識を、類似という理由だけで流用しない

## フォルダ構成

```text
technical_decision_os/
  README.md
  schemas/
    technical_knowledge.schema.json
  templates/
    decision_rule.json
    compatibility_rule.json
    failure_card.json
    benchmark_card.json
    migration_rule.json
  knowledge/
    decisions/
    compatibility/
    failures/
    benchmarks/
    migrations/
  scripts/
    validate_knowledge.py
    search_knowledge.py
```

## 標準フロー

```text
案件条件を構造化
↓
既知のFailure Cardを先に検索
↓
Decision Ruleで候補を絞る
↓
Compatibility Ruleで組み合わせを検査
↓
Migration RuleでPoCと本番の境界を明示
↓
MVP Contractへ採用IDを記録
↓
Golden Datasetと品質ゲートで検証
↓
結果をE0→E2/E3へ昇格、または棄却
```

## 検索

```bash
python3 technical_decision_os/scripts/search_knowledge.py --keyword IFC
python3 technical_decision_os/scripts/search_knowledge.py --kind compatibility --domain BIM
python3 technical_decision_os/scripts/search_knowledge.py --min-evidence 3 --status active
python3 technical_decision_os/scripts/search_knowledge.py --id DEC-DOC-001 --json
```

## 検証

```bash
python3 technical_decision_os/scripts/validate_knowledge.py
```

検証項目：

- JSON構文
- ID重複
- kind別必須項目
- Evidence Level
- confidence範囲
- 日付形式と再検証期限
- `active`なのにEvidenceが弱すぎる知識
- 参照先IDの存在

## 新規知識の登録規律

1. まず`templates/`から作る
2. 未検証なら`status: candidate`、EvidenceはE0/E1にする
3. 検証前に「反証条件」「失敗時の症状」を書く
4. 実データで検証したらEvidenceをE3へ上げる
5. 効かなかった知識は削除せず`rejected`または`retired`へ変更する
6. 案件固有の偶然を一般原則に昇格しない。異なる2種類目のデータで再検証する

## MVP Contractとの接続

MVP Contractには、必ず以下を記録する。

```json
{
  "technical_decisions": {
    "required_ids": ["DEC-DOC-001"],
    "compatibility_checks": ["COMP-IFC-001"],
    "known_failures": ["FAIL-DOC-001"],
    "migration_rules": ["MIG-IFC-001"]
  }
}
```

これにより、コードだけを見ても分からない「なぜその構成にしたか」を再現できる。

# MVP Factory

顧客仮説・技術判断を、**証拠付きで完成判定できるMVP**へ変換する実行レイヤー。

## なぜ必要か

プロンプトでコードを生成するだけでは、速くても品質は安定しない。MVP Factoryは、完成条件を人間の感覚から分離し、次の4点を固定する。

1. 何を証明するMVPか
2. どのデータ・技術判断を使うか
3. 何が通れば顧客へ見せてよいか
4. 結果を次案件へどう残すか

## 構成

```text
mvp_factory/
  README.md
  contracts/
    mvp_contract.schema.json
    _template.json
  quality/
    definition_of_done.md
    risk_budget.md
    demo_readiness.md
  evals/
    golden_case.schema.json
    _template.json
  scripts/
    verify_mvp.py
```

## 1. MVP Contract

MVP開始前に`contracts/_template.json`をコピーし、案件固有の契約を作る。

MVP Contractは要件書ではない。次を機械判定できる形で固定する。

- 仮説と反証条件
- 利用者が行う判断
- 入力・処理・出力
- Golden Dataset
- 成功・失敗・棄却条件
- 参照するTechnical Decision ID
- 品質ゲートコマンド
- デモのLive / Replay / Mock切替

## 2. Golden Dataset

AI・検索・抽出・変換処理では、画面が動くだけでは完成ではない。重要ケース10〜30件から始め、少なくとも次を含める。

- 正常系
- 境界値
- 判定不能を返すべきケース
- 過去に失敗したケース
- 顧客が特に気にするケース

## 3. Quality Gate

```bash
python3 mvp_factory/scripts/verify_mvp.py \
  --contract path/to/mvp_contract.json \
  --project-root path/to/project
```

検証内容：

- Contractの必須項目
- Technical Decision IDの存在
- Golden Datasetの存在・構文
- L3データのローカル処理宣言
- 必須コマンドの実行結果
- 必須成果物の存在
- 検証レポート生成

## 4. 完成判定

MVPは次の状態になって初めて顧客提示可能とする。

```text
Hypothesis Gate
  仮説・反証条件・判断者が明確

Data Gate
  入力データ・Golden Case・機密区分が明確

Technical Gate
  技術判断ID・非互換・既知の失敗を確認

Build Gate
  typecheck / test / eval / build等が通る

Demo Gate
  Live失敗時のReplay/Mockとresetがある

Decision Gate
  Pass / Pivot / Killの次アクションが決まっている
```

## 5. 技術判断OSとの接続

Contractの`technical_decisions`に採用根拠を残す。

- `required_ids`: 選択ルール
- `compatibility_checks`: 組み合わせ制約
- `known_failures`: 既知の地雷
- `migration_rules`: PoC→本番の移行境界

コードが動いても、この参照が空なら「なぜその構成か」が再現できないため、原則Warning扱いとする。

## 6. PM Brainへの回収

PoC終了後は次を案件ファイルへ残す。

- Contract path
- Quality Gate report path
- 実際に効いたTechnical Decision ID
- 誤っていたDecision ID
- 新しく見つかったFailure Card候補
- Golden Caseへ追加した事例
- Evidence Levelの昇格・降格

案件数が増えるほど、スターター・技術判断・テストが強くなる状態を目指す。

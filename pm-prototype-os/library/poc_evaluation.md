# PoC Evaluation v0.6

PoCは「作れたか」ではなく、**顧客価値・業務適合・技術品質・本番移行可能性を証拠で判定する**。

## 判定構造

```text
MVP Contract達成
＋
Golden Dataset評価
＋
Technical Decisionの妥当性
＋
顧客価値・業務適合
＋
事業性
＝
Go / Conditional Go / Hold / No-Go
```

## 評価前の必須成果物

- MVP Contract
- Quality Gate Report
- Golden Datasetと結果
- 顧客原文・現物Evidence
- 使用したTechnical Decision ID
- デモ時の顧客反応・判断

いずれかがない場合、強いGo判定をしない。

## 評価軸

| 評価軸 | 見ること | Evidence |
|---|---|---|
| 顧客価値 | 顧客が何を判断し、何が変わったか | 発言引用・行動 |
| 業務適合 | 入力・確認・承認・出力へ入るか | 実フロー |
| 技術実現性 | ContractとQuality Gateを満たすか | 自動レポート |
| データ適合 | 原本・Golden Case・更新性 | 実データ |
| 精度許容 | 正答・根拠・abstention | eval結果 |
| 運用負荷 | 人間確認・準備・管理コスト | 実測 |
| 本番化リスク | 権限・監査・責任・移行 | Migration Rule |
| 事業性 | ROI・予算・横展開 | 顧客・社内判断 |

## S/A/B/C

### S：すぐ進める

- Contract達成
- 実データ・Golden Datasetで価値が出た
- 顧客の明確な利用意思または次行動がある
- 本番移行条件が見える
- 重大Failureを回避できる

### A：条件付きで進める

- 価値はあるが、データ・運用・精度に条件
- 追加Benchmarkまたは別データ検証が必要
- Migration Ruleのトリガーが近い

### B：保留

- デモ反応はあるが業務利用者・判断者が不明
- 技術的には動くが、検索・AI以外が真因
- Quality Gateは通るがROIが不明

### C：やらない

- 仮説が反証された
- データが使えない
- 根拠・abstentionを満たせない
- 責任・機密・契約リスクが許容不能
- 既存ツールで十分

## Go / No-Goテンプレート

```text
# PoC評価

## 結論
Go / Conditional Go / Hold / No-Go

## PM最終判断
※AIは空欄のまま渡す

## Contract達成状況

## 顧客価値Evidence

## Golden Dataset結果

## Quality Gate結果

## Technical Decisionの結果
- 効いたDecision ID
- 誤っていたDecision ID
- 回避できたFailure ID
- 新しいCompatibility候補
- Migration Trigger

## 業務適合

## 本番化リスク

## 事業性

## 次に検証すること

## 顧客に確認すること

## エンジニアに確認すること
```

## Technical Decision OSへの回収

PoC終了後、案件だけを更新して終わらせない。

### Decisionを昇格する

次を満たす場合、Evidence Levelを上げる。

- E0/E1 → E2：最小コードで動作
- E2 → E3：実データで再現
- E3 → E4：顧客デモで価値確認
- E4 → E5：本番継続利用

### Failure Cardを作る

次のいずれかが起きたらFailure候補を作る。

- 画面は動くが結果が信用されない
- 依存組み合わせで再現性が崩れる
- 1種類目では成功し、2種類目で破綻
- 本番要件が出た瞬間に構成変更が必要
- デモ停止・根拠ずれ・判定不能失敗

### 棄却も残す

効かなかったDecisionを削除しない。

- `status: rejected`
- どの条件で外れたか
- 反証Evidence
- 代替案

を残し、次回同じ誤りを防ぐ。

## PM Brainへの反映

`pm_brain/cases/`の該当案件へ次を記録する。

- `poc_result`
- `decision_ids / failure_ids / migration_ids`
- `mvp_contract`
- `quality_report`
- `max_evidence`
- 「技術判断の結果」
- 「OSへ昇格するもの」

## 典型的な失敗判定

- デモは受けたが、利用者・判断者がいない
- 顧客は面白いと言ったが、次行動がない
- AI精度よりデータ準備がボトルネック
- 自動化対象の業務が標準化されていない
- 根拠ページがずれているのに正答率だけ高い
- PoCライブラリをそのまま本番候補にしている
- Quality Gateを通さず、説明で成功扱いしている

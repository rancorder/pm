# 05 Engineer Handoff v0.6

PMからエンジニアへ渡す実装依頼テンプレート。説明文だけでなく、機械検証可能な成果物を添付する。

## 1. 背景

- 顧客・案件：
- 業務領域：
- 現在の症状：
- 真因仮説：
- Evidence：
- なぜ今やるか：

## 2. 検証したいこと

```text
顧客は〇〇業務で△△に時間・ミスが発生している。
真因は□□である可能性があり、今回のMVPでは××を検証する。
反証条件は○○である。
```

## 3. 正本ファイル

- MVP Contract：
- Golden Dataset：
- 顧客原文・現物：
- Data Policy区分：L1 / L2 / L3

## 4. Technical Decision

| 種別 | ID | 採用理由・確認事項 |
|---|---|---|
| Decision |  |  |
| Compatibility |  |  |
| Failure |  |  |
| Migration |  |  |

## 5. MVP範囲

- 入力：
- 処理：
- 出力：
- 利用者：
- 判断してもらうこと：
- 成功条件：
- 判定不能条件：
- 今回やらないこと：

## 6. 画面

| 画面 | 顧客が判断すること | 主な表示 | 根拠表示 |
|---|---|---|---|
|  |  |  |  |

## 7. 品質ゲート

| Gate | コマンド | 必須 |
|---|---|---|
| typecheck |  | Yes |
| unit/integration test |  | Yes |
| Golden Dataset eval |  | Yes |
| build/run |  | Yes |
| security/dependency |  | 案件条件による |

## 8. デモ耐障害

- Live Mode：
- Replay Mode：
- Mock Mode：
- Reset手順：
- 外部API失敗時：
- AI失敗時：

## 9. 実装者に確認したいこと

- Contractで技術的に成立しない箇所はどこか
- 価値検証に不要な実装は何か
- どのKnown Failureが最も起きやすいか
- PoCと本番で作り直す箇所はどこか
- Golden Caseへ追加すべき境界値は何か
- 顧客デモで止まりやすい依存は何か

## 10. 完了条件

- `verify_mvp.py`の必須Gateが成功
- 必須成果物が存在
- Known limitationsが記録済み
- 顧客提示用のLive/Replay/Mockいずれか2系統が動く
- PMがPass / Pivot / Killを判断できるEvidenceがある

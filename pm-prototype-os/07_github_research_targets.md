# 07 GitHub / Technical Research v0.6

技術調査の目的はOSS名を増やすことではない。**案件条件に対する選択・非選択・相性・失敗・移行判断を更新すること**。

## 調査前に書くこと

```text
調査したい判断：
現在の候補：
採用条件：
非採用条件：
比較する指標：
反証条件：
検証に使う実データ：
成果物にするKnowledge kind：
```

## 調査対象

### Construction / AECO

- IFC解析・属性検証
- IDS / BCF / OpenBIM
- 図面・仕様書・議事録の根拠付き検索
- 書類→正準データ→転記
- モデル・図面・議事録の変更追跡

### AI / Search

- 完全一致・メタデータ・全文・ベクトル・ハイブリッド検索の使い分け
- OCR時の座標・ページ・表構造保持
- Structured Outputと決定論的検算
- Agent導入が必要になる境界
- abstention・根拠表示・評価方式

### Prototype / Production

- 0→60を短縮するStarter
- PoC限定ライブラリと本番候補の境界
- CI / E2E / eval / dependency検査
- Live / Replay / Mock
- ローカル処理・機密データ境界

## 読む順番

1. 公式README・Docs
2. Release / maintenance status
3. Issues（失敗症状・非互換）
4. Examples / tests
5. ライセンス
6. 最小コードでE2検証
7. 実データでE3検証

星数・記事の勢い・AIの推薦だけで選ばない。

## 成果物

調査結果は次のいずれかへ保存する。

| 状態 | 保存先 |
|---|---|
| 未検証の外部情報 | `library/external_watch_log.md` |
| 人間向け概要 | `cards/` |
| 条件付き技術判断 | `technical_decision_os/knowledge/decisions/` |
| 相性・非互換 | `technical_decision_os/knowledge/compatibility/` |
| 既知の地雷 | `technical_decision_os/knowledge/failures/` |
| 比較実験 | `technical_decision_os/knowledge/benchmarks/` |
| PoC→本番移行 | `technical_decision_os/knowledge/migrations/` |
| 動く最小構成 | `starters/` |

## 昇格ルール

```text
外部記事・公式Docs確認 = E1
↓
最小構成で動作 = E2
↓
実データで評価 = E3
↓
顧客デモで価値確認 = E4
↓
本番運用 = E5
```

- E0/E1は`candidate`
- E2以上で条件付き`active`
- 異なる2種類目のデータで再現しない限り、一般原則として強く断定しない
- 効かなかった知識は削除せず、`rejected`として理由を残す

## Tech Card化ルール

Tech Card v2には、概要だけでなく以下を含める。

- When to use
- When not to use
- Works well with
- Breaks when combined with
- PoC構成
- 本番構成
- 移行トリガー
- 既知の失敗症状
- Evidence Level
- 最終検証日・再検証期限
- 対応するTechnical Decision ID

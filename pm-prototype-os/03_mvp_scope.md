# 03 MVP Scope v0.6

プロトタイプを超短時間で作り、何を証明できたかまで判定するためのMVP切り出しルール。

## MVPの定義

MVPは最小機能ではなく、**最小検証単位**。

```text
何を検証するか
↓
誰が判断するか
↓
どのデータで試すか
↓
どの技術判断を採用するか
↓
何が出れば成功・失敗か
↓
どの証拠を残すか
```

## 3分類

### A. Demo MVP

顧客に業務改善イメージを掴んでもらう。

- 画面・操作体験を優先
- Mock/Replay中心でもよい
- 顧客が何を判断するかを固定する

### B. Data MVP

実データで抽出・検索・分類・照合の価値を検証する。

- Golden Dataset必須
- 正答率だけでなく判定不能率を見る
- 原本・ページ・要素等の根拠を保持する

### C. Workflow MVP

既存業務フローへ入るか検証する。

- 入力者・確認者・承認者
- 通知・出力先
- 修正ループ
- 責任分界
- 人間確認の位置

## MVP候補比較

| 案 | 仮説 | 入力 | 出力 | 判断者 | 成功条件 | 技術リスク | 捨てる機能 |
|---|---|---|---|---|---|---|---|
| A |  |  |  |  |  |  |  |
| B |  |  |  |  |  |  |  |
| C |  |  |  |  |  |  |  |

## Executable MVP Contract

推奨MVPを選んだら、`mvp_factory/contracts/_template.json`を使って完成条件を固定する。

最低限、次を空欄にしない。

- `hypothesis.statement`
- `hypothesis.evidence`
- `hypothesis.falsification`
- `user.decision_to_make`
- `scope.input / processing / output / out_of_scope`
- `data.golden_dataset`
- `acceptance.functional / quality / abstention`
- `technical_decisions.*`
- `quality_gate.commands`
- `demo.fallback`
- `decision.pass / pivot / kill`

## 技術判断

MVP案ごとに、`technical_decision_os/`から次を検索する。

1. Failure Card：先に地雷を探す
2. Decision Rule：採用候補を絞る
3. Compatibility Rule：組合せを検査する
4. Migration Rule：PoCと本番の境界を決める

技術名だけを書かず、必ずDecision IDをContractへ残す。

## 初期MVPで原則捨てる

- ログイン
- 本格的な権限管理
- 完璧なDB設計
- 完全自動化
- 大量データ対応
- 高度なデザイン
- 例外処理の網羅
- 本番インフラ最適化

## 捨てない

- 顧客が価値を判断できる画面
- 実データに近い入力
- Before / After
- 原本への根拠
- 判定不能を返す仕組み
- データ破壊防止
- 機密区分
- ReplayまたはMock
- Pass / Pivot / Kill条件

## Arent領域の例

### BIMチェックMVP

IFCを読み込み、部材一覧・属性欠損・根拠要素を表示する。3Dは価値判断に必要な場合だけ付ける。

### 図面・仕様書検索MVP

限定資料を対象に、図番・条件・変更理由を根拠ページ付きで回答する。識別子検索と意味検索を混同しない。

### Doc-to-Data MVP

異種書類を共通コア＋タイプ別プロファイルへ抽出し、決定論的検算と要確認フラグを出す。

### 設計レビューMVP

議事録・図面・仕様書の不整合候補を一覧化し、AI確定ではなく人間が確認する優先順位を作る。

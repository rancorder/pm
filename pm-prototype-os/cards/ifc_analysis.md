# Tech Card: IFC Analysis v2

## 技術名

IFC解析 / OpenBIMデータ抽出 / 属性検証

## 一言でいうと

IFCを3Dモデルとして眺めるだけでなく、部材・属性・関係・数量を業務データとして抽出し、欠損・不整合候補を確認する。

## 参照元

- IfcOpenShell / ifctester
- ThatOpen系
- 既存PoC Starter：`starters/ifc-mvp/`
- 機械判断：`COMP-IFC-001` / `MIG-IFC-001`

## 何ができるか

- 部材・属性・階層・関係性・数量の抽出
- 属性欠損・命名不備・ルール違反候補の表示
- IFC要素を根拠にしたレビュー
- IDS準拠チェックへの接続

## 解決できる顧客課題

- BIMモデルを人手で確認している
- 属性欠損や命名不備を見逃す
- 設計レビューが属人化している
- 何が違反したか根拠要素を追えない

## Arent領域との親和性

- BIM：高
- Revit：高
- IFC：最高
- 配筋：中
- プラント：中〜高
- 図面 / 仕様書RAG：高

## 入力 / 出力

| 区分 | 内容 |
|---|---|
| 入力 | IFC、Revit等からの出力、チェックルール |
| 処理 | 要素・属性抽出、欠損・ルール候補判定 |
| 出力 | 部材表、属性表、欠損候補、根拠要素、レビューリスト |

## When to use

- IFCが実際に取得できる
- 顧客が部材・属性・欠損を確認したい
- 3D操作より一覧・チェック結果に価値がある
- 実データでルール検証したい

## When not to use

- 元データがPDFしかなくIFCが存在しない
- 真因が承認・版管理・責任分界であり、IFC解析が直接効かない
- 3Dビューを見せること自体が目的化している
- 本番規模・継続運用なのにPoC Starterをそのまま採用しようとしている

## Works well with

- 属性表UI
- Evidence Viewer
- IDS / ifctester
- Python側の決定論的ルールチェック
- 図面・仕様書RAGへ渡す構造化テキスト

## Breaks when combined with

- web-ifc-viewer系と複数threeバージョンの混在
- WASM配置を手作業に依存
- 大容量IFCを低メモリ端末のブラウザだけで全処理
- PoCライブラリを保守境界未確認のまま本番採用

## MVPでの使い方

IFCアップロード→部材一覧→属性欠損候補→根拠要素を1画面で表示する。価値判断に不要なら3Dを後回しにする。

## PoC構成

`starters/ifc-mvp/`を再利用。実IFCで壁・ドア・窓・属性取得を確認済み。依存関係は`COMP-IFC-001`に従う。

## 本番構成

処理量・保守・IDS要件に応じ、ThatOpen / IfcOpenShell / ifctester等へ再設計する。`MIG-IFC-001`を参照。

## 移行トリガー

- 大容量IFC
- サーバーバッチ
- 複数案件・複数利用者
- IDS準拠
- 継続保守

## 既知の失敗

| 症状 | 原因候補 | 診断 | 対処 |
|---|---|---|---|
| 3Dが表示されない | three重複・WASM 404 | dependency tree / network | COMP-IFC-001 |
| ブラウザが重い | 全要素・3Dを同時処理 | ファイルサイズ・メモリ | 一覧中心、サーバー処理検討 |
| 欠損判定が信用されない | ルール・根拠不足 | 元要素とルール確認 | IDS・根拠要素表示 |

## 実装難易度

PoC：中 / 本番：高

## Technical Decision ID

- Compatibility：`COMP-IFC-001`
- Migration：`MIG-IFC-001`

## Evidence

- Evidence Level：E3（PoC Starter）
- 検証：実IFCで壁・ドア・窓・属性欠損候補
- 反証条件：異なるIFC出力元・大容量で再現しない場合
- Confidence：0.95（PoC範囲）

## 鮮度

- 最終確認日：2026-07-22
- 再検証期限：2026-09-22
- PoC Starter：境界付き利用
- 後継候補：ThatOpen / IfcOpenShell / ifctester

## 顧客に聞くべき質問

1. IFCを日常的に取得できるか
2. 最も時間がかかるチェック項目は何か
3. 結果を誰がどの形式で確認・承認するか

## エンジニアに聞くべき質問

1. 対象IFCの最大容量・出力元は何か
2. 3Dなしで価値検証できるか
3. IDSへ寄せるべきルールは何か

# Construction Research Sources

建設業ドメイン情報をPM Prototype OSに取り込むための調査ソース。

## 行政・制度・業界動向

### 国土交通省 / BIM-CIM / i-Construction

確認すべきテーマ。

- BIM/CIM原則適用
- i-Construction 2.0
- 建設現場のオートメーション
- インフラDX
- 施工管理のデジタル化
- 電子納品
- 建設業の働き方改革
- 施工体制台帳・契約・下請構造

PM観点。

- 建設DX提案の社会的背景になる
- 顧客の稟議理由に使える
- 「なぜ今やるのか」を説明できる

## BIM / IFC / IDS

### IFC / OpenBIM

確認すべきテーマ。

- IFCデータ構造
- BIM属性情報
- IFCバージョン
- model checking
- IDS: Information Delivery Specification

PM観点。

- BIMモデルをAIで扱う入口
- 属性欠損チェック・納品チェックに直結
- Revit依存を超えたデータ活用に使える

### 最新研究メモ

2026年時点では、BIM情報要求からIDS/XMLを生成・検証する研究が出ている。

- Ishigaki-IDS-Bench
- Ishigaki-IDS

示唆。

- LLMは自然言語のBIM要求を一部構造化できる
- ただしXML/IFC語彙/外部バリデータ制約があり、専門家レビューは必須
- PM Prototype OSでは「完全自動化」ではなく「IDSドラフト生成＋検証＋専門家レビュー」が現実的

## 点群 / Scan to BIM

確認すべきテーマ。

- 点群処理
- 既存建物のBIM化
- 壁・床・開口抽出
- IFC変換
- 改修・維持管理

最新研究メモ。

- Cloud2BIMのように、点群からIFC形式のBIMモデル化を自動化するOSS/研究が出ている

PM観点。

- 新築よりも改修・維持管理で刺さりやすい
- いきなり完全BIM化ではなく、一部要素抽出からMVP化する

## 建設現場CV / 写真AI

確認すべきテーマ。

- 現場写真分類
- 重機・作業員・資材検出
- 安全リスク検知
- 施工進捗の画像認識
- 撮影漏れ・証跡管理

最新研究メモ。

- SODAのような建設現場向け物体検出データセットが存在する
- VCVW-3Dのように、3D注釈付きの仮想建設現場データセットも出ている

PM観点。

- 現場写真AIは魅力的だが、誤検知・現場環境差・リアルタイム性の要求に注意
- 初期MVPは「自動判定」ではなく「分類・候補提示・証跡整理」が安全

## 建設ドキュメントRAG

確認すべきテーマ。

- 図面PDF
- 仕様書
- 議事録
- 見積書
- 工程表
- 検査記録
- 竣工図

PM観点。

- 建設業の最初のAI導入として現実的
- データが散乱している企業ほど刺さる
- 根拠表示・版管理・権限管理が重要

## OSS調査先

| 領域 | 候補 |
|---|---|
| AECO全般 | Awesome-AECO |
| BIM/IFC | IfcOpenShell, BlenderBIM |
| BIMチェック | model-checker, IDS tools |
| 点群 | Cloud2BIM系 |
| RAG | LlamaIndex, LangGraph, Haystack |
| UI/Prototype | Next.js, shadcn/ui, React Flow |
| 自動化 | Playwright, n8n |

## PM Prototype OSへの取り込み方

```text
公開情報・OSS・研究
↓
ドメインカード化
↓
顧客ヒアリング質問化
↓
MVP候補化
↓
プロトタイプ指示化
↓
実装検証
```

## 注意

- 行政・制度情報は変更されるため、提案前に最新版を確認する
- OSSはライセンス確認必須
- 研究成果はPoC向きで、本番利用には検証が必要
- 建設業は法令・契約・安全・品質の責任が重いため、AIは必ず根拠表示と人間レビューを前提にする

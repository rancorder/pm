# OSS Catalog

PM Prototype OSで技術探索に使うOSSカテゴリカタログ。

## 使い方

顧客課題が出たら、該当カテゴリを見てPoC候補を選ぶ。

```text
顧客課題
↓
技術カテゴリ
↓
OSS候補
↓
PoC利用可否
↓
本番利用リスク
```

## 評価軸

| 評価項目 | 見るポイント |
|---|---|
| 用途適合 | 顧客課題に直接効くか |
| PoC速度 | すぐ試せるか |
| 本番性 | 長期運用できるか |
| ライセンス | 商用利用・改変・再配布条件 |
| 更新頻度 | 継続メンテされているか |
| 学習コスト | エンジニアが扱いやすいか |
| Arent親和性 | BIM/Revit/設計/プラントと近いか |

---

## 01 BIM / IFC

### 候補

- IfcOpenShell（Python、サーバーサイド処理向け）
- web-ifc-viewer / web-ifc（JavaScript、ブラウザ完結・MIT）— `starters/ifc-mvp/`で動作実績あり。詳細は`cards/ifc_analysis.md`
- Speckle（BIMデータの版管理・相互運用、Apache 2.0）— 詳細は`cards/speckle_version_control.md`
- BlenderBIM
- BIMROCKET
- model-checker
- IDS tools（buildingSMART公式）— 詳細は`cards/ids_validation.md`

### 使う課題

- IFC解析
- BIM属性チェック
- モデル品質検証
- 部材一覧抽出
- BIM納品チェック
- モデルのバージョン管理・差分比較

### PoC向き

高。特にweb-ifc-viewerはサーバー不要でブラウザ完結するため、初動の速さでは最有力。

### 注意

- IFCデータ品質に依存
- 3D表示は後回しでよい（ただしweb-ifc-viewerは3D表示自体が軽量なので、顧客デモのインパクトを優先するなら先に出してもよい）
- ライセンス確認必須（IfcOpenShell/BlenderBIMはLGPL系、web-ifc-viewer/SpeckleはMIT/Apache 2.0）

---

## 02 RAG / Document AI

### 候補

- LlamaIndex
- LangChain
- LangGraph
- Haystack
- Chroma
- Qdrant
- Weaviate

### 使う課題

- 図面/仕様書/議事録検索
- 設計ルールRAG
- 設備台帳検索
- 過去案件検索

### PoC向き

最高。

### 注意

- 根拠表示必須
- PDF/OCR品質に依存
- 機密資料の扱いに注意

---

## 03 PDF / OCR / Table Extraction

### 候補

- PyMuPDF
- pdfplumber
- Camelot
- Tabula
- Tesseract
- PaddleOCR

### 使う課題

- 見積書抽出
- 仕様書抽出
- 図面表題欄抽出
- 検査記録抽出

### PoC向き

高。

### 注意

- スキャンPDFは難易度が上がる
- 表形式の崩れに注意
- 完全自動ではなく確認画面が必要

---

## 04 Computer Vision / Image AI

### 候補

- OpenCV
- YOLO
- Detectron2
- Segment Anything
- Grounding DINO

### 使う課題

- 現場写真分類
- 安全リスク候補
- 施工状況把握
- 部材検出

### PoC向き

中。

### 注意

- 現場環境差が大きい
- 誤検知前提のUIが必要
- リアルタイム検知は初期MVPでは避ける

---

## 05 Point Cloud / 3D

### 候補

- Open3D
- PDAL
- Potree
- CloudCompare関連
- Three.js

### 使う課題

- 点群可視化
- 出来形比較
- Scan to BIM
- 既存建物調査

### PoC向き

中。

### 注意

- データ容量が大きい
- ブラウザ表示が重くなりやすい
- 初期は一部データで検証する

---

## 06 CAD / Geometry

### 候補

- FreeCAD
- OpenCascade
- ezdxf
- Three.js

### 使う課題

- 図面データ処理
- DXF解析
- 形状確認
- 簡易3D表示

### PoC向き

中。

### 注意

- CAD形式ごとの差が大きい
- 商用CADとの互換性に注意

---

## 07 Workflow / Automation

### 候補

- n8n
- Temporal
- Airflow
- Prefect
- Playwright

### 使う課題

- 定期処理
- ファイル収集
- レポート生成
- Web操作自動化
- 承認フロー

### PoC向き

高。

### 注意

- 自動化は運用責任が重い
- まずは半自動化から始める

---

## 08 UI / Prototype

### 候補

- Next.js
- React
- shadcn/ui
- React Flow
- Mermaid
- Tailwind CSS

### 使う課題

- 顧客確認用画面
- ダッシュボード
- ワークフロー表示
- AI解析結果レビュー画面

### PoC向き

最高。

### 注意

- 見た目を作り込みすぎない
- 業務フローが伝わるUIを優先する

---

## 09 Agent / Tool Use

### 候補

- LangGraph
- AutoGen
- CrewAI
- OpenAI Agents SDK
- MCP Servers

### 使う課題

- AI Agent化
- 複数ツール連携
- Revit/BIM操作計画
- PM補助エージェント

### PoC向き

中〜高。

### 注意

- 実行権限を与えすぎない
- 操作計画→人間承認→実行の順にする

---

## 10 GIS / Map

### 候補

- QGIS
- Leaflet
- MapLibre
- PostGIS

### 使う課題

- 土木/インフラ位置情報
- 現場管理
- 設備台帳
- 点検対象マップ

### PoC向き

中。

### 注意

- 地図ライセンス
- 座標系
- 既存GISデータ連携

## OSSカード化テンプレ

```text
技術名：
カテゴリ：
解決する課題：
PoCでの使い方：
本番化リスク：
ライセンス確認：
Arent親和性：S/A/B/C
次に見るべきファイル：README / examples / docs / issues
```

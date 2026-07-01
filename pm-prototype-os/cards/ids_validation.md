# Tech Card: IDS Validation（buildingSMART公式）

## 技術名

IDS（Information Delivery Specification）/ BIM情報要求の機械可読化・自動検証

## 参照元

- GitHub: https://github.com/buildingSMART/IDS
- Docs: https://technical.buildingsmart.org/projects/information-delivery-specification-ids/

## 何ができるか

「このBIMモデルにはこの属性・分類・関係性が必要」という発注者側の情報要求を、XML形式（IDS）で機械可読に定義し、実際のIFCモデルがその要求を満たしているかを自動検証できる。buildingSMART公式の標準仕様＋検証ツール群。

## 解決できる顧客課題

- BIM納品チェックが目視・属人化している
- 「属性が入っているはず」が実際には入っていない
- 発注者要求（EIR）とモデルの整合確認に時間がかかる

## Arent領域との親和性

- BIM: 最高
- Revit: 高
- IFC: 最高
- 配筋: 低
- プラント: 中
- 図面/仕様書RAG: 低

## 入力

- IDS定義ファイル（発注者の情報要求をXML化したもの）
- 検証対象のIFCモデル

## 出力

- 適合/不適合の判定結果
- 不適合箇所の一覧（どの要素の、どの属性が欠けているか）

## MVPでの使い方

`cards/ifc_analysis.md`（および`starters/ifc-mvp/`）の属性欠損チェックは「決め打ちの4項目」だが、IDSを使うと顧客ごとに異なる要求ルールを外部定義として持てるようになる。初期MVPでは、顧客の発注要求を数項目だけIDS形式に翻訳し、`starters/ifc-mvp/`のチェックロジックと差し替えて動くことを確認するのが現実的な第一歩。

## プロトタイプ案

```text
顧客の情報要求（自然言語）
↓
IDS定義（GPT/Claudeで下書き生成 → 人間レビュー）
↓
IFCモデルに対する検証
↓
不適合レポート
```

## 実装難易度

中〜高（IDS仕様自体の理解に学習コストがある。ただし「自然言語の要求からIDSドラフトを生成し、専門家がレビューする」という運用は`domain/construction_research_sources.md`に記載のIshigaki-IDS-Bench等の研究とも整合する）

## 注意点

- ライセンス：buildingSMARTの標準仕様は公開されているが、検証エンジン側は実装によりライセンスが異なるため個別確認が必要
- 完全自動生成は避け、IDSドラフト生成＋専門家レビューを基本にする（`construction_research_sources.md`の既存方針と一致）
- IDS自体の学習コストが高いため、顧客に見せる前にPM自身が最小のIDS定義を1つ動かしてみることを推奨

## 顧客に聞くべき質問

1. BIM納品時の情報要求（EIR）は文書化されているか？
2. 現在の納品チェックはどの程度自動化されているか？
3. どの属性の欠損が一番業務に影響するか（積算/維持管理/施工のどれか）？

## エンジニアに聞くべき質問

1. IDS検証エンジンはどれを使うか（複数の実装が存在するため要調査）？
2. `starters/ifc-mvp/`の属性欠損チェックロジックをIDSベースに差し替える工数はどの程度か？

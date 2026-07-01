# IFC MVP Starter

`cards/ifc_analysis.md` の「IFC Upload → Model Summary → Element Table → Missing Attribute Check」を、実際に動くコードにしたもの。IFCファイルをドラッグ&ドロップすると、数秒で3D表示・部材一覧・属性（欠損候補つき）が出る。

使用OSS: [web-ifc-viewer](https://github.com/ThatOpen/web-ifc-viewer)（MIT） / [web-ifc](https://github.com/ThatOpen/engine_web-ifc)（MIT）。サーバー不要、ブラウザだけで完結する。

## 検証済み

以下は実際に動かして確認済み（2026-07-01時点、Node v22 / npm 10）。

- `npm install` → `npm run build` → 成功（107モジュール、dist生成）
- `tsc --noEmit` → 型エラー0件
- ヘッドレスブラウザでの読み込みテスト（`sample/IfcOpenHouse_IFC4.ifc`使用）
  - ステータス: `読み込み完了`
  - 部材検出: 壁4 / ドア1 / 窓5 / スラブ2 / 階段部材1 / 屋根1 / 部材20 / プレート5
  - 部材クリック → 属性取得成功（GlobalId / Name / PredefinedType）
  - 属性欠損候補の自動検出も動作（Description / ObjectType / Tagが空の場合に表示）
  - コンソールエラー0件（WebGLソフトウェアフォールバックの警告のみ、実行環境依存で無害）

## 使い方

```bash
cd starters/ifc-mvp
npm install       # postinstallでweb-ifcのwasmをpublic/へ自動コピー
npm run dev        # http://localhost:5173 で起動
```

`sample/IfcOpenHouse_IFC4.ifc` をドラッグ&ドロップすればすぐ試せる（[IfcOpenShell](https://github.com/IfcOpenShell)由来の公開サンプルデータ、[ThatOpen/engine_web-ifc](https://github.com/ThatOpen/engine_web-ifc)のテストフィクスチャ経由で取得）。

顧客の実IFCで試す場合も同じ手順。IFC2X3/IFC4どちらも読める（web-ifcの対応範囲に準ずる）。

## 既知の詰まりポイント（先回りメモ）

`web-ifc-viewer`のエコシステムは依存バージョンが噛み合っていない箇所がある（2026年7月時点）。

- `web-ifc-viewer@1.0.218`はpeerDependencyで`three@^0.135.0`を要求するが、実際に使っている`web-ifc-three`は`three@^0.149.0`を要求する
- そのまま`npm install`すると`ERESOLVE`で失敗する
- 対応：`package.json`で`three`を`^0.149.0`に固定し、`overrides`でツリー全体に強制適用している（このリポジトリの`package.json`は対応済み）
- 新しいエコシステム（`@thatopen/components`）への移行も選択肢だが、API設計がより複雑（World/Fragments/IfcLoaderの明示的な配線が必要）になるため、「30分でMVP」を優先してこちらを採用した

## 次にやると良いこと（本番化に向けて）

- 属性欠損チェックのルールをカスタマイズ可能にする（現状は固定4項目）
- レポート出力（CSV/PDF）— `poc_evaluation.md`のPoC評価に使える形で
- 大容量IFC（数百MB級）でのパフォーマンス検証。現状は`IfcOpenHouse_IFC4.ifc`（113KB）でのみ検証済み
- `virtual_design_review/expert_roles.md`のAI Engineerロールが指摘するであろう点：3D表示は価値検証後でよい、という`technology_decision_rules.md`の判断04と、このスターターの位置づけ（3D表示ありき）が矛盾する場合は、部材一覧＋属性表示だけの表形式版も検討する

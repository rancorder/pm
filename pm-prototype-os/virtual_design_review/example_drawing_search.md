# Example: Drawing Search Request

## Customer Request

```text
図面をAIで検索したい。
```

## Role Reviews

### Construction Domain Expert

#### View

これは単純な検索ではなく、図面番号、版管理、設計変更、仕様書との関係が絡む可能性が高い。

#### Suspected Causes

- 最新版が分からない
- 図面番号ルールが不統一
- 図面と仕様書が紐づいていない
- 議事録の変更が反映されたか追えない

#### Recommended Question

探したいのは、図面ファイルそのものか、図面内の情報か、変更履歴か。

#### MVP

図面台帳＋版管理＋根拠付き検索。

### Product Manager

#### View

成功条件がまだ曖昧。誰の何分を削減するのか確認が必要。

#### Recommended MVP

最初は1案件分の図面台帳と検索画面。

### Software Architect

#### View

いきなりRAGより、メタデータ構造化が先。

#### Recommended Stack

Next.js、shadcn/ui、CSV/JSON図面台帳、PDFメタデータ抽出。

### AI Engineer

#### View

RAGを使うなら根拠表示必須。スキャンPDFならOCR品質がリスク。

#### Recommended MVP

テキスト抽出可能なPDFに限定して根拠表示を作る。

### UX Designer

#### View

チャットUIだけでは価値が伝わりにくい。

#### Recommended UI

図面一覧、版、更新日、承認状態、検索結果、根拠表示。

### Business Owner

#### View

図面検索だけだと単発になりやすい。設計変更管理や仕様書RAGまで横展開できる形がよい。

### Risk / Ops

#### View

最新版判定や承認状態を誤ると業務リスクがある。AI回答を確定情報にしない。

## PM Integrated Decision

### Cause Ranking

1. 図面版管理ができていない
2. 図面内情報の検索性が低い
3. 議事録変更が図面反映とつながっていない

### First Question

```text
探したいのは、図面ファイルそのものですか？
それとも図面内に書かれた情報ですか？
```

### Recommended MVP

図面台帳・版管理・根拠付き検索の1画面プロトタイプ。

### UI Pattern

- Difference Review Table
- RAG Evidence Viewer
- Project Brain View

### Technical Pattern

```text
Next.js
shadcn/ui
mock drawing metadata
PDF text extraction mock
source evidence panel
```

### Success Condition

- 顧客が最新版を迷わず見つけられる
- 検索結果に根拠が表示される
- 次に管理すべきメタデータが明確になる

### Do Not Do

- 全図面対応
- 自動判定
- 本番権限管理
- 3D/BIM表示

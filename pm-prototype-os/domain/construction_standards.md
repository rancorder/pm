# Construction Standards

`construction_glossary.md`は業務用語中心のため、Arent文脈で顧客やエンジニアから出てくる可能性が高い**標準規格・周辺ツール**を別出しで整理する。

## なぜ別ファイルにしたか

PM Prototype OS v0.1のレビューで、ISO 19650・CDE・BCF・COBie・Digital Twin・buildingSMART・Civil 3D・Navisworchksが用語集・OSSカタログのどこにも0件であることが判明した。建設業ドメインの理解として明確な穴だったため追加する。

---

## ISO 19650（情報マネジメント国際標準）

| 項目 | 内容 |
|---|---|
| 正式名称 | Organization and digitization of information about buildings and civil engineering works, including building information modelling (BIM) — Information management using building information modelling |
| 構成 | Part 1（概念と原則）/ Part 2（プロジェクトの引渡し段階）/ Part 3（資産運用段階） |
| PMでの見方 | 顧客が「BIM発注要件」「EIR」「BEP」と言ったら、ほぼ確実にISO 19650文脈。情報マネジメントの責任分界・命名規則・承認フローを定義する標準 |
| 真因追求での使い道 | `Rule` / `Organization`カテゴリの真因仮説に直結する。「BIM活用したいが運用ルールがバラバラ」という顧客課題は、ISO 19650準拠の運用ルール未整備が真因であることが多い |

## CDE（Common Data Environment）

| 項目 | 内容 |
|---|---|
| 意味 | プロジェクトの情報（図面・BIM・議事録・仕様書）を一元管理する環境。ISO 19650で要求される概念 |
| PMでの見方 | 「図面・BIMモデル・議事録の正本がどこにあるか分からない」という顧客課題は、CDEが存在しない/機能していないことが真因であるケースが多い |
| Root Cause Engineとの接続 | `Data`カテゴリの真因候補に「CDE不在・形骸化」を追加する |
| MVP化の方向性 | 完全なCDE構築はPoC規模を超える。初期MVPは「対象案件1件分の正本ファイル一覧＋更新履歴の可視化」に絞る |

## BCF（BIM Collaboration Format）

| 項目 | 内容 |
|---|---|
| 意味 | buildingSMART策定。BIMモデル上の指摘・課題をソフトウェア間でやり取りするための標準フォーマット（XML） |
| PMでの見方 | 設計レビュー・指摘管理のMVPを作るなら、BCFに準拠した形でデータを持たせておくと、将来Revit/Navisworks/Solibri等の既存ツールと接続しやすくなる |
| MVP化の方向性 | `prototype_ui_patterns.md`の「UI Pattern 04: AI Candidate Review Board」と相性が良い。候補カードの内部データ構造をBCF項目（タイトル・説明・ステータス・優先度・関連要素ID）に寄せておく |

## COBie（Construction Operations Building Information Exchange）

| 項目 | 内容 |
|---|---|
| 意味 | 維持管理段階で必要な設備・資産情報を、BIMから構造化データとして引き渡すための標準 |
| PMでの見方 | `industry_domain_library.md`08番「維持管理/FM」と直結。「設備台帳と図面が分断」という顧客課題の理想形がCOBie形式での引き渡し |
| MVP化の方向性 | COBie完全準拠は重い。初期MVPは「IFCから抽出した属性をCOBie項目（Type/Component/System等）にマッピングできるか確認する」程度から始める |

## Digital Twin

| 項目 | 内容 |
|---|---|
| 意味 | 物理アセット（建物・設備・インフラ）をデジタル上にリアルタイムに近い形で再現し、監視・予測・意思決定に使う仕組み |
| PMでの見方 | 経営層・事業責任者に刺さるキーワード。`virtual_design_review/expert_roles.md`のBusiness Ownerロールが「横展開できるか」を語る際の語彙として使える |
| 注意 | 顧客が「Digital Twinをやりたい」と言ったときほど、Root Cause Engineで疑うべき。多くの場合、実態は「BIM/IFC属性すら整っていない」段階で、Digital Twinは数段階先のゴール |

## buildingSMART

| 項目 | 内容 |
|---|---|
| 意味 | IFC・BCF・IDS・MVD・IDM・bsDDなど、OpenBIM標準を策定する国際組織 |
| PMでの見方 | 出典として明記しておくと提案資料の信頼性が上がる。「IFCは○○社の独自規格ではなく、buildingSMARTが策定するオープン標準」という説明は、ベンダーロックイン回避を重視する発注者に刺さる |

## Civil 3D / Navisworks（Autodesk、Revit以外の主要ツール）

| ツール | 領域 | PMでの見方 |
|---|---|---|
| Civil 3D | 土木設計（道路・造成・上下水道） | 土木領域の顧客では、Revitではなくこちらが主戦場。`industry_domain_library.md`02番「土木」のMVP候補を考える際は、IFCよりLandXML/Civil 3D形式を意識する |
| Navisworks | 施工調整・干渉確認・4Dシミュレーション | 「配管・機器の干渉確認が大変」という課題は、Navisworksでの干渉チェック業務の属人化・非効率が真因であることが多い。Speckleのコネクタ経由でNavisworksデータを扱える可能性も検討する |

## このファイルの使いどころ

- 顧客ヒアリングで上記の単語が出たら、即座に「相手が何を指しているか」を確認する質問に変換する（`06_arent_domain_questions.md`に追加質問として統合してもよい）
- Virtual Design ReviewのConstruction Domain Expertロールが、これらの標準を前提知識として持っているという体（てい）でレビューコメントを生成させる

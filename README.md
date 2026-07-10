# pm

このリポジトリの主役は **PM Prototype OS** です。

→ [`pm-prototype-os/README.md`](./pm-prototype-os/README.md)

ArentでのエンジニアPM業務（建設DX）に向けた、顧客ヒアリング・真因追求・要件定義・MVP設計・プロトタイプ指示を高速化するためのPM補助OS（GPT/Claude/Claude Code/Codex/Geminiに読み込ませて使うナレッジ＋プロンプト体系）です。

---

## 営業支援OS

営業支援案件のDrive原本・商談ログ・議事録・文字起こしをもとに、案件ごとの営業戦略、差分検知、定例論点、次アクションを管理するOSです。

→ [`sales-os/README.md`](./sales-os/README.md)

現在の登録案件:

- [福美人株式会社](./sales-os/clients/fukubijin/README.md)

---

## このリポジトリの構成

```text
pm/
  pm-prototype-os/   ← PM Prototype OS本体
    starters/ifc-mvp/ ← 実際に動くIFC MVPスターター（web-ifc-viewer使用、動作検証済み）
  sales-os/          ← 営業支援OS。顧客別の営業戦略・差分検知・定例論点
    clients/         ← クライアント別OS
  archive/           ← 過去の別プロジェクト（PM Prototype OSとは無関係）
  CHANGELOG.md        ← バージョン履歴
```

## クイックスタート

1. [`pm-prototype-os/README.md`](./pm-prototype-os/README.md) を読む
2. [`pm-prototype-os/project_context/gpt_claude_project_sources.md`](./pm-prototype-os/project_context/gpt_claude_project_sources.md) をGPT/Claude Projectに読み込ませる
3. 顧客打ち合わせ後、[`pm-prototype-os/01_customer_interview.md`](./pm-prototype-os/01_customer_interview.md) の型に沿って入力する

## 営業支援OS クイックスタート

1. [`sales-os/README.md`](./sales-os/README.md) を読む
2. 対象クライアントのOSを開く
3. Drive原本との差分を確認する
4. 定例論点・宿題・次アクションを更新する

## `archive/` について

`archive/interview-presentation-2025/` は、PM Prototype OSとは無関係な別プロジェクト（面接用プレゼンテーション）です。リポジトリの履歴上の経緯でルートに同居していたものを隔離しています。詳細は同フォルダ内のREADMEを参照してください。

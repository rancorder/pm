# pm

このリポジトリの主役は **PM Prototype OS** です。

→ [`pm-prototype-os/README.md`](./pm-prototype-os/README.md)

ArentでのエンジニアPM業務（建設DX）に向け、顧客ヒアリング・真因追求・技術判断・MVP設計・自動検証を高速化するためのPM補助OSです。

## PM Prototype OS v0.6

```text
顧客発言・現物
↓
真因仮説 / Evidence
↓
Technical Decision OS
↓
Executable MVP Contract
↓
Starter / AI実装
↓
Golden Dataset / Quality Gate
↓
顧客デモ
↓
PM Brainへ学習回収
```

主要レイヤー：

- `root_cause_engine/`：8カテゴリ真因分析・Evidence
- `technical_decision_os/`：条件付き技術選択・相性・失敗・移行
- `mvp_factory/`：MVP Contract・Golden Dataset・品質ゲート
- `starters/`：実際に動くMVPスターター
- `pm_brain/`：案件横断の判断・学習メモリ

## 営業支援OS

営業支援案件のDrive原本・商談ログ・議事録・文字起こしをもとに、案件ごとの営業戦略、差分検知、定例論点、次アクションを管理するOSです。

→ [`sales-os/README.md`](./sales-os/README.md)

現在の登録案件：

- [福美人株式会社](./sales-os/clients/fukubijin/README.md)

## リポジトリ構成

```text
pm/
  pm-prototype-os/   # PM Prototype OS本体
  sales-os/          # 営業支援OS
  archive/           # 過去の別プロジェクト
  .github/workflows/ # OS品質ゲート
  CHANGELOG.md       # バージョン履歴
```

## クイックスタート

1. [`pm-prototype-os/README.md`](./pm-prototype-os/README.md)を読む
2. 顧客議事録・現物を`01_customer_interview.md`の型へ入れる
3. `03_mvp_scope.md`で推奨MVPを決める
4. Technical Decisionを検索する
5. MVP Contractを作る
6. Starter / AIで実装する
7. `python3 pm-prototype-os/scripts/verify_os.py`でOS自体を検証する
8. 案件MVPは`mvp_factory/scripts/verify_mvp.py`で検証する

## archive

`archive/interview-presentation-2025/`はPM Prototype OSとは無関係な別プロジェクトです。

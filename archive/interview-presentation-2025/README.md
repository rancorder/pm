# 旧コンテンツ：面接プレゼンテーション（Project Failure Simulator）

このフォルダは、PM Prototype OSとは無関係の別プロジェクトです。

2025年の面接（FPT面接）向けに作成したインタラクティブプレゼン（"Project Failure Simulator" / 失敗シミュレーター）の実装で、リポジトリのルートに直接置かれていたため、PM Prototype OSのコード資産であるかのように見えてしまっていました。

## 経緯

このリポジトリ（`rancorder/pm`）は元々この面接プレゼン用に作られ、後から`pm-prototype-os/`が追加されました。`vercel.json`のビルド対象もこちらを向いたままだったため、リポジトリを開いた人（採用担当者・レビュアーを含む）が「PM Prototype OSは実は動くコードを持たない」と誤解する原因になっていました。

## 今後の対応（推奨）

理想は別リポジトリ（例：`rancorder/interview-presentation-2025`）へ完全に分離することです。このフォルダは暫定的な隔離措置です。

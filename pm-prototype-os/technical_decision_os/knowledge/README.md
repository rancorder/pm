# Technical Knowledge Registry

この配下のJSONは、Technical Decision OSの正本。

- `decisions/`: 条件付き選択
- `compatibility/`: 相性・非互換
- `failures/`: 失敗症状・地雷
- `benchmarks/`: 比較実験
- `migrations/`: PoC→本番移行

未検証情報を直接`active`で登録しない。外部記事はまず`library/external_watch_log.md`へ置き、E2以上に検証してから昇格する。

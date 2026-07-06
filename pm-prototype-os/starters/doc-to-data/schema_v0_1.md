# 正準スキーマ v0.1（doc-to-data）

> v0（単層）は `starters/doc-to-data/schema_v0.md` に検証記録として残す。
> v0.1で単層を捨て2層にした理由は、A系スキーマにB系(見積書)を乗せたら
> 15フィールド中6がnull・10が意味ズレを起こしたため（2026-07 検証2本）。
> 判断過程を残すため、v0は削除せず並置する。

## 設計：共通コア ＋ 書類タイプ別プロファイル

### 共通コア（全書類タイプで乗る。A/B検証で実証済み）
```
core:
  line_items[]:                    # 明細（A/B両方で機能）
    no / name_spec / qty / unit / unit_price / amount
    confidence / flag              # 負値・割引・非課税行に対応すること
  tax                              # 消費税
  total                            # 税込合計
  conditions[]:                    # 特記/備考
    text / category / confidence / flag
  doc_meta:
    doc_type                       # work_order(A) / supplier_estimate(B) / ...
    estimate_date
    self_role                      # ★自社から見た立場: 受注者 / 発注者 / 元請 …
```
全フィールドに value / confidence / source の3点セット（詳細は card: doc_to_data）。

### プロファイル A（工事書類 / NTT系）
```
profile_A:
  case_name            # 工事件名（工事全体の粒度）
  location             # 施工場所
  client_division      # 発注区分（NTTのどの支店か）
  contractor           # 受注者（＝自社）
  period_from / period_to
  cost_breakdown:      # 工事費の費目構成
    direct_cost        # 直接工事費（労務込み）
    common_temp_cost / site_mgmt_cost / general_mgmt_cost
    construction_price # 工事価格(税抜)
```

### プロファイル B（見積書 / 供給者系）
```
profile_B:
  quote_title          # 見積の件名（機材など一部の粒度。工事全体ではない）
  supplier             # 供給者（メーカー/専門業者）
  addressed_to         # 宛先（＝自社が発注側）
  valid_until          # 有効期限
  subtotal             # 小計（機材費のみ。A系のdirect_costとは意味が違う）
  excluded_scope[]     # 見積外の費用範囲（据付調整費など）
  risk_conditions[]    # 前提リスク（搬入不可時の追加費など）
```

## 分析ゴールとの接続
代表の狙い（データ蓄積→分析）は共通コアの line_items に効く。
A/Bどちらのプロファイルでも line_items は同じ形なので、
明細レベルの横断分析（部材別・数量・単価推移）は2層設計でも成立する。

## 検算層の必須テストケース（v0.1で追加）
- マイナス行（値引き）: qty × unit_price の符号を正しく扱うこと
- 非課税行 / 税率混在
- 「一式」など数量根拠のない行 → medium で人の確認へ
- 明細合計 vs 費目/小計 の突合（省略・欠損の検出）

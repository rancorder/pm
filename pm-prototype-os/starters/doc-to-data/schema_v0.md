# 正準スキーマ v0（doc-to-data 検証用）

書類の種類が変わっても、この共通の「背骨」に一度落とす。
A系（NTT書類）もB系（プラネスト見積もり）も、ここに乗ることを検証する。

## 設計原則
- 全フィールドに `value / confidence / source` の3点セットを持たせる
- confidence: high / medium / low の3段階（lowは人の確認へ回す）
- source: どの書類の・どの見出し/行から取ったか（出典トラッキング）
- 元書類に無い項目は value=null、confidence=null とし、捏造しない

## スキーマ構造

project:                # 工事案件（1件）
  case_name             # 工事件名
  location              # 工事場所
  client_division       # 発注区分（NTT のどの支店か）
  contractor            # 受注者
  period_from / period_to  # 工期
  estimate_date         # 積算年月日
  engineer              # 担当技術者

cost_summary:           # 総括表
  direct_cost           # 直接工事費
  common_temp_cost      # 共通仮設費
  site_mgmt_cost        # 現場管理費
  general_mgmt_cost     # 一般管理費
  construction_price    # 工事価格（税抜）
  tax                   # 消費税
  total                 # 工事費計（税込）

line_items[]:           # 明細（複数行）
  no / name_spec / qty / unit / unit_price / amount

conditions[]:           # 特記事項（NTT提出で効く条件）
  text / category       # category: 検査 / 接地 / 材料 / 作業条件 など

## NTT提出書類への転記マッピング（A系）
NTT定型書類の各欄が、正準スキーマのどこから来るかの対応。

NTT書式の欄            ← 正準スキーマ
─────────────────────────────────
工事名称               ← project.case_name
施工場所               ← project.location
請負者名               ← project.contractor
工期                   ← project.period_from 〜 period_to
請負金額(税込)         ← cost_summary.total
立会検査希望日         ← conditions[category=検査] から抽出
接地種別               ← conditions[category=接地]

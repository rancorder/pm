#!/usr/bin/env python3
"""
verify.py — doc-to-data の決定論的検算層。

抽出済み正準データ(JSON)を受け取り、AIの読み取りを機械で照合する。
「勝ち筋は賢い抽出ではなく後ろの安い検算層」（card: doc_to_data 原則3）を実装したもの。

使い方:
    python3 verify.py samples/extracted_A.json
    python3 verify.py samples/extracted_B.json

検査項目:
  1. 明細の行内検算（qty × unit_price == amount）※負値・割引行に対応
  2. 明細合計 vs 費目/小計（省略・欠損の検出）
  3. 総括表の内部整合（税抜+税=税込 など。A系のみ）
  4. 低確度/フラグ付きフィールドの一覧（人の確認=HITL へ回す対象）
"""
import json, sys

def get(d, *keys):
    for k in keys:
        if isinstance(d, dict) and k in d:
            d = d[k]
        else:
            return None
    return d

def main(path):
    d = json.load(open(path, encoding="utf-8"))
    print(f"# 検算: {path}\n")

    # 1. 行内検算（負値対応）
    print("== 1. 明細 行内検算（qty × unit_price == amount）==")
    bad = 0
    for it in d.get("line_items", []):
        qty, up, amt = it.get("qty"), it.get("unit_price"), it.get("amount")
        if qty is None or up is None or amt is None:
            print(f"  {it.get('no','?'):10} 数量/単価/金額に欠損 → 要確認")
            bad += 1
            continue
        calc = qty * up
        ok = calc == amt        # 負×負=正 も正しく比較される
        bad += not ok
        print(f"  {str(it.get('no','?')):10} 計算={calc:>10,} 記載={amt:>10,} {'OK' if ok else '★不一致'}")
    print(f"  → 不一致 {bad} 件\n")

    # 2. 明細合計 vs 費目/小計
    print("== 2. 明細合計 vs 費目/小計 ==")
    s = sum(it.get("amount", 0) for it in d.get("line_items", []))
    ref = get(d, "cost_summary", "direct_cost", "value")
    if ref is not None:
        diff = ref - s
        msg = "OK" if diff == 0 else f"差額 {diff:,}（省略/欠損の可能性）"
        print(f"  明細合計={s:,}  参照(直接費/小計)={ref:,}  {msg}\n")
    else:
        print(f"  明細合計={s:,}  参照値なし\n")

    # 3. 総括表 内部整合（あれば）
    c = d.get("cost_summary", {})
    def cv(k): return get(c, k, "value")
    if cv("construction_price") is not None and cv("tax") is not None and cv("total") is not None:
        print("== 3. 総括表 内部整合 ==")
        cp, tax, tot = cv("construction_price"), cv("tax"), cv("total")
        print(f"  税抜+税={cp+tax:,}  税込記載={tot:,}  {'OK' if cp+tax==tot else '★不一致'}\n")

    # 4. HITL 対象（low/medium/flag）
    print("== 4. 人の確認へ回す項目（low/medium/flag）==")
    def walk(o, p=""):
        r = []
        if isinstance(o, dict):
            conf = o.get("confidence")
            if conf in ("low", "medium") or o.get("flag"):
                r.append((p, conf, o.get("flag", "")))
            for k, v in o.items():
                if k not in ("value", "confidence", "source", "flag"):
                    r += walk(v, f"{p}.{k}" if p else k)
        elif isinstance(o, list):
            for i, v in enumerate(o):
                r += walk(v, f"{p}[{i}]")
        return r
    for p, conf, flag in walk(d):
        print(f"  [{str(conf):6}] {p}")
        if flag:
            print(f"           └ {flag}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: python3 verify.py <extracted.json>")
    main(sys.argv[1])

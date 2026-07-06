# doc-to-data スターター

「書類→AI抽出→正準データ→転記」パイプラインの設計・検証キット。
Arentの狩猟域（電気設備・空調）で反復する書類地獄→データ化の共通型。
設計思想は `cards/doc_to_data.md`、スキーマは `schema_v0_1.md` を参照。

## 中身
```
schema_v0.md        # 初版(単層)。破綻の記録として保存。削除しない
schema_v0_1.md      # 現行(共通コア＋書類タイプ別プロファイルの2層)
verify.py           # 決定論的検算層。抽出JSONを機械照合しHITL対象を出す
samples/
  積算内訳書_日々総合設備.txt   # A系ソース(工事積算, 罠込み)
  見積書_東和空調.txt           # B系ソース(供給者見積, 構造が違う)
  extracted_A.json / extracted_B.json  # 抽出結果(確度・出典付き)
```

## 使い方
```bash
python3 verify.py samples/extracted_A.json   # 工事書類の検算
python3 verify.py samples/extracted_B.json   # 見積書の検算(割引行のHITL実演)
```

## このキットで確認できること
1. 三層（抽出→正準→転記）が実書類で機能するか
2. 確度・出典トラッキングが要確認フラグに直結するか
3. 検算層が省略・欠損・割引行を機械的に捕まえるか
4. 1つのスキーマが書類タイプをまたいで乗るか（→乗らない。2層が必要）

## 次の検証（8月・実データ）
- 実NTT書類 / 実プラネスト見積もりで2層スキーマを再検証
- ContextGem / Unstract を当てて電気工事書類への耐性を測定
- 結果を `cards/doc_to_data.md` の候補OSS欄に追記

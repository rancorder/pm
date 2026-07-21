# MVP Definition of Done

MVPは「画面が動いた」では完成ではない。以下のGateをすべて確認し、未達を意図的に受容する場合はMVP Contractへ例外理由を残す。

## 1. Hypothesis Gate

- [ ] 検証したい仮説が1文で書かれている
- [ ] 顧客発言・現物・業務フローのEvidenceがある
- [ ] 反証条件が書かれている
- [ ] 誰が何を判断するデモか明確
- [ ] Pass / Pivot / Kill後の次アクションがある

## 2. Scope Gate

- [ ] 入力・処理・出力が明確
- [ ] 今回やらないことが明確
- [ ] 本番要件とPoC要件を混同していない
- [ ] 価値判断に不要なログイン・権限・高度デザインを作っていない

## 3. Data Gate

- [ ] L1/L2/L3分類を付けた
- [ ] L3はローカル処理または匿名化方針がある
- [ ] Golden Caseが存在する
- [ ] 正常系だけでなく、境界・判定不能・過去失敗を含む
- [ ] 原本への参照を失っていない

## 4. Technical Decision Gate

- [ ] 採用技術のDecision IDがある
- [ ] Compatibility Ruleを確認した
- [ ] 既知のFailure Cardを検索した
- [ ] PoC構成から本番構成への移行条件を明記した
- [ ] Evidence Levelと再検証期限を確認した

## 5. Quality Gate

- [ ] typecheckまたは同等の静的検査
- [ ] 重要ロジックのテスト
- [ ] Golden Dataset評価
- [ ] buildまたは実行確認
- [ ] 必須成果物の存在確認
- [ ] 必須コマンド失敗時は顧客提示を止める

## 6. Demo Gate

- [ ] Live Modeがある
- [ ] ReplayまたはMock Modeがある
- [ ] 初期状態へ戻せる
- [ ] エラー時に画面全体が停止しない
- [ ] 顧客に「できること・できないこと」を先に伝える
- [ ] デモ中の質問を次要件として記録できる

## 7. Learning Gate

- [ ] Quality Gateレポートを保存した
- [ ] PoC結果をPM Brainへ反映した
- [ ] 新しいFailure候補を記録した
- [ ] 効いたDecision IDを記録した
- [ ] Evidence Levelを昇格・降格した
- [ ] 再利用できるテスト・コンポーネントを切り出した

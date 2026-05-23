# おもいでカード (memory-cards)

Flips through reminiscence cards with an emoji and a short phrase, edited by family, to prompt conversation.

「おもいでカード」は、高齢者と家族・介護者の会話のきっかけを作る Chrome 拡張です。家族が絵文字と短い言葉のカードを編集し、利用者は大きな表示のカードを前後にめくれます。

## 単一用途

Flips through reminiscence cards with an emoji and a short phrase, edited by family, to prompt conversation.

## 重要な方針

- 非医療の生活支援ツールです。診断、治療、医療助言、医療効果や健康改善の主張は行いません。
- API やネットワーク通信は使いません。データは Chrome の `storage` にのみローカル保存します。
- 発信、通話、メッセージ送信、SNS 連携はありません。
- 権限は `storage` のみです。`host_permissions` はありません。

## 使い方

1. 画面上部のカードを見ながら「前へ」「次へ」でカードをめくります。
2. 「家族用カード編集」で絵文字と短い言葉を編集し、「保存」を押します。
3. 「カードを追加」で新しいカードを増やせます。
4. 不要なカードは「削除」で消せます。カードは少なくとも1枚残ります。

## 開発

```bash
npm install
npm run build
```

`npm run build` により `dist/` が生成され、Chrome Web Store 提出用の `manifest.json`、`_locales/ja`、`_locales/en`、`icons/icon16.png`、`icons/icon48.png`、`icons/icon128.png` が含まれます。

## Chrome での確認

1. `npm run build` を実行します。
2. Chrome で `chrome://extensions` を開きます。
3. 「デベロッパー モード」を有効にします。
4. 「パッケージ化されていない拡張機能を読み込む」から `dist/` を選びます。

## Premium 枠組み

Premium は `$3` の買い切り想定です。現時点では `src/core/premium.ts` の `STRIPE_PAYMENT_LINK` は placeholder のままで、初回起動日時から7日トライアル状態をローカルに判定します。Premium が無効でもカード閲覧・編集の基本機能は動作します。

## 移植性

- 純ロジックは `src/core/` に配置し、`chrome.*` へ依存しません。
- 保存処理は `src/storage/` のアダプタ越しに行います。
- Chrome の保存実装は `chrome.storage.local` のみを使います。
- 言語取得などプラットフォーム固有処理は `src/platform/` に隔離します。

## Legal

- [Privacy](legal/PRIVACY.md)
- [Disclaimer](legal/DISCLAIMER.md)

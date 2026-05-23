# memory-cards (おもいでカード) — 仕様
単一用途(EN): Flips through reminiscence cards with an emoji and a short phrase, edited by family, to prompt conversation.

非医療: 診断・治療・医療効果をうたわない。

## Chrome Web Store 提出方針

- Manifest V3
- 権限は `storage` のみ
- `host_permissions` なし
- API/ネットワーク通信なし
- `_locales/ja` と `_locales/en` を同梱
- アイコン: `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`
- 純ロジックは `src/core/`、保存アダプタは `src/storage/`

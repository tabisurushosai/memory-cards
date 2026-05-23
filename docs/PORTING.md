# Porting guide

This app is written so the same card logic can be reused by Chrome, iOS, Android, or another local-only shell.

## Boundaries

- `src/core/` is pure application logic. Keep it free of `chrome.*`, browser extension APIs, network calls, DOM access, and platform storage details.
- `src/storage/` owns persistence adapters. UI code should use only the `AppStorage` interface from this directory.
- `src/platform/` owns small platform probes such as language detection.
- UI code should stay close to standard DOM and local state so a native shell can replace the rendering layer without changing `src/core/`.

## Storage contract

The persisted state remains under the `memoryCardsState` key and has the `AppState` shape from `src/core/appState.ts`.

When adding a platform:

1. Implement the `AppStorage` interface with local device storage.
2. Return `StoredAppState | undefined` from `load()` without changing the stored shape.
3. Pass loaded data through `normalizeAppState()` before use.
4. Keep saves local-only unless the product requirement explicitly changes.

For Chrome, `ChromeAppStorage` receives a minimal `KeyValueStorageArea`, currently backed by `chrome.storage.local`. Native iOS or Android shells should provide an equivalent adapter backed by their local persistence APIs.

## Platform rules

- Do not add permissions, host permissions, remote code, external CDN assets, or external fonts for portability work.
- Keep manifest v3 for the Chrome extension target.
- Prefer adding platform-specific code under `src/platform/` or `src/storage/` instead of importing platform APIs from `src/core/`.
- Run `npm run build` after changes to ensure the Chrome target still builds.

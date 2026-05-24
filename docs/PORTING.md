# Porting guide

This app is written so the same card logic can be reused by Chrome, iOS, Android, or another local-only shell.

## Boundaries

- `src/core/` is pure application logic. Keep it free of `chrome.*`, browser extension APIs, network calls, DOM access, and platform storage details.
- `src/storage/` owns persistence adapters. Platform-neutral code should import contracts from `src/storage/index.ts`; Chrome-only wiring lives in `src/storage/chromeAppStorage.ts`.
- `src/platform/` owns small platform probes such as language detection.
- UI code should stay close to standard DOM and local state so a native shell can replace the rendering layer without changing `src/core/`.

## Storage contract

The persisted state remains under the `memoryCardsState` key and has the `AppState` shape from `src/core/appState.ts`.

The storage interfaces are intentionally split:

- `AppStorage` loads and saves the whole app state for UI code.
- `StorageAdapter` is the small key/value persistence boundary for Chrome, iOS, Android, or test adapters. Its `read()` and `write()` methods are the only operations platform adapters need to provide.
- `createAppStorageFromAdapter()` wraps any `StorageAdapter` with the shared app-state key, so platform adapters do not duplicate key handling.

When adding a platform:

1. Implement `StorageAdapter` from `src/storage/StorageAdapter.ts` with local device storage, or implement `AppStorage` directly if the platform already exposes app-state persistence.
2. Keep the `memoryCardsState` key and stored `AppState` shape unchanged.
3. Keep adapter values as plain structured data. Do not store platform metadata alongside the app state.
4. Return `StoredAppState | undefined` from `load()` without adding platform metadata to the stored value.
5. Pass loaded data through `normalizeAppState()` before use.
6. Keep saves local-only unless the product requirement explicitly changes.

For Chrome, `ChromeStorageAdapter` wraps the minimal `chrome.storage.local` `get`/`set` surface, and `createChromeExtensionAppStorage()` is the only storage factory that probes `globalThis.chrome`. Native iOS or Android shells should avoid importing `src/storage/chromeAppStorage.ts`; instead, provide an equivalent `StorageAdapter` backed by local persistence APIs and pass it to `createAppStorageFromAdapter()`.

## Native shell checklist

- Treat `src/core/` as a one-way dependency: UI, storage, and platform shells may import it, but `src/core/` must not import `src/storage/`, `src/platform/`, DOM APIs, `chrome.*`, or native SDK APIs.
- Put iOS/Android persistence bridges behind `StorageAdapter` and keep them in `src/storage/` or the native shell layer.
- Import only `src/storage/index.ts` or `src/storage/StorageAdapter.ts` from native code unless the target is the Chrome extension.
- Keep UI decisions platform-neutral where practical: call pure functions from `src/core/`, then render with the current platform's view layer.
- If a native target needs platform probes such as locale detection, add them outside `src/core/` and pass the result in.
- Keep native persistence adapters thin: map `read(key)` and `write(key, value)` to the platform's local key/value API, and let `createAppStorageFromAdapter()` own the `memoryCardsState` key.

## Core portability guard

`npm run build` first compiles `src/core/` with `tsconfig.core.json`, which excludes DOM and browser extension types. If this step fails, move the platform-specific code back behind `src/platform/`, `src/storage/`, or the UI shell and keep `src/core/` as data and pure decision logic.

For iOS or Android, start by reusing `src/core/appState.ts`, `src/core/cards.ts`, and `src/core/premium.ts` unchanged. The native shell should provide its own view layer and a local `StorageAdapter` implementation, then call `normalizeAppState()` after loading persisted data.

## Platform rules

- Do not add permissions, host permissions, remote code, external CDN assets, or external fonts for portability work.
- Keep manifest v3 for the Chrome extension target.
- Prefer adding platform-specific code under `src/platform/` or `src/storage/` instead of importing platform APIs from `src/core/`.
- Run `npm run build` after changes to ensure the Chrome target still builds.

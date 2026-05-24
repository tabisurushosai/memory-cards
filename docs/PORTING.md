# Porting guide

This app is written so the same card logic can be reused by Chrome, iOS, Android, or another local-only shell.

## Boundaries

- `src/core/` is pure application logic. Keep it free of `chrome.*`, browser extension APIs, network calls, DOM access, and platform storage details.
- `src/storage/` owns persistence adapters. UI code should use only the `AppStorage` interface from this directory.
- `src/platform/` owns small platform probes such as language detection.
- UI code should stay close to standard DOM and local state so a native shell can replace the rendering layer without changing `src/core/`.

## Storage contract

The persisted state remains under the `memoryCardsState` key and has the `AppState` shape from `src/core/appState.ts`.

The storage interfaces are intentionally split:

- `AppStorage` loads and saves the whole app state for UI code.
- `StorageAdapter` is the small key/value persistence boundary for Chrome, iOS, Android, or test adapters.

When adding a platform:

1. Implement `StorageAdapter` from `src/storage/StorageAdapter.ts` with local device storage, or implement `AppStorage` directly if the platform already exposes app-state persistence.
2. Keep the `memoryCardsState` key and stored `AppState` shape unchanged.
3. Return `StoredAppState | undefined` from `load()` without adding platform metadata to the stored value.
4. Pass loaded data through `normalizeAppState()` before use.
5. Keep saves local-only unless the product requirement explicitly changes.

For Chrome, `ChromeStorageAdapter` wraps the minimal `chrome.storage.local` `get`/`set` surface and `AdapterAppStorage` applies the shared app-state key. Native iOS or Android shells should provide an equivalent `StorageAdapter` backed by their local persistence APIs.

## Native shell checklist

- Treat `src/core/` as a one-way dependency: UI, storage, and platform shells may import it, but `src/core/` must not import `src/storage/`, `src/platform/`, DOM APIs, `chrome.*`, or native SDK APIs.
- Put iOS/Android persistence bridges behind `StorageAdapter` and keep them in `src/storage/` or the native shell layer.
- Keep UI decisions platform-neutral where practical: call pure functions from `src/core/`, then render with the current platform's view layer.
- If a native target needs platform probes such as locale detection, add them outside `src/core/` and pass the result in.

## Core portability guard

`npm run build` first compiles `src/core/` with `tsconfig.core.json`, which excludes DOM and browser extension types. If this step fails, move the platform-specific code back behind `src/platform/`, `src/storage/`, or the UI shell and keep `src/core/` as data and pure decision logic.

For iOS or Android, start by reusing `src/core/appState.ts`, `src/core/cards.ts`, and `src/core/premium.ts` unchanged. The native shell should provide its own view layer and a local `StorageAdapter` implementation, then call `normalizeAppState()` after loading persisted data.

## Platform rules

- Do not add permissions, host permissions, remote code, external CDN assets, or external fonts for portability work.
- Keep manifest v3 for the Chrome extension target.
- Prefer adding platform-specific code under `src/platform/` or `src/storage/` instead of importing platform APIs from `src/core/`.
- Run `npm run build` after changes to ensure the Chrome target still builds.

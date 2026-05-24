export function getChromeGlobal<TChrome extends object>(): TChrome | undefined {
  return (globalThis as typeof globalThis & { readonly chrome?: TChrome }).chrome;
}

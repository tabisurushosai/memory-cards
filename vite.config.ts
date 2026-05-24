import { defineConfig } from "vite";

const extensionPublicDir = "public";
const extensionOutDir = "dist";
const requiredExtensionAssets = [
  "manifest.json",
  "icons/icon16.png",
  "icons/icon48.png",
  "icons/icon128.png"
] as const;

function extensionAssetUrl(baseDir: string, assetPath: string): URL {
  return new URL(`${baseDir}/${assetPath}`, import.meta.url);
}

function extensionAssetParentUrl(baseDir: string, assetPath: string): URL {
  return new URL("./", extensionAssetUrl(baseDir, assetPath));
}

function copyRequiredExtensionAssetsPlugin() {
  return {
    name: "copy-required-extension-assets",
    apply: "build" as const,
    async closeBundle() {
      const fsModuleName = "node:fs/promises";
      const fs = await import(fsModuleName);

      await Promise.all(
        requiredExtensionAssets.map(async (assetPath) => {
          const source = extensionAssetUrl(extensionPublicDir, assetPath);
          const destination = extensionAssetUrl(extensionOutDir, assetPath);

          await fs.mkdir(extensionAssetParentUrl(extensionOutDir, assetPath), {
            recursive: true
          });
          await fs.copyFile(source, destination);
        })
      );
    }
  };
}

export default defineConfig({
  publicDir: extensionPublicDir,
  plugins: [copyRequiredExtensionAssetsPlugin()],
  build: {
    outDir: extensionOutDir,
    emptyOutDir: true,
    copyPublicDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});

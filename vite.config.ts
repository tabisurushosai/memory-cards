import { defineConfig } from "vite";

const extensionPublicDir = "public";
const extensionOutDir = "dist";

export default defineConfig({
  publicDir: extensionPublicDir,
  build: {
    outDir: extensionOutDir,
    emptyOutDir: true,
    copyPublicDir: true,
    modulePreload: {
      polyfill: false
    },
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

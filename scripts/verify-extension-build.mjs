import { readFileSync } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const manifestPath = path.join(distDir, "manifest.json");

const requiredIcons = {
  16: "icons/icon16.png",
  48: "icons/icon48.png",
  128: "icons/icon128.png"
};

const requiredFiles = [
  "manifest.json",
  "index.html",
  "_locales/ja/messages.json",
  "_locales/en/messages.json",
  ...Object.values(requiredIcons)
];

const assertFileExists = async (relativePath) => {
  await access(path.join(distDir, relativePath));
};

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

for (const [size, iconPath] of Object.entries(requiredIcons)) {
  if (manifest.icons?.[size] !== iconPath) {
    throw new Error(`manifest.json must reference ${iconPath} for ${size}px icon`);
  }
}

await Promise.all(requiredFiles.map(assertFileExists));

console.log("Verified Chrome extension build output includes manifest.json and icons.");

// scripts/copy-wasm.mjs
// web-ifc の .wasm バイナリは npm パッケージの中に入っているが、
// ブラウザから直接fetchできる場所（public/）にコピーしておく必要がある。
// これを忘れると「IFCファイルを開いても反応しない」という分かりにくい詰まり方をするため、
// postinstall で自動化しておく。

import { existsSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "node_modules", "web-ifc");
const dest = join(root, "public");

if (!existsSync(src)) {
  console.warn("[copy-wasm] node_modules/web-ifc が見つかりません。npm install を先に実行してください。");
  process.exit(0);
}

if (!existsSync(dest)) {
  mkdirSync(dest, { recursive: true });
}

const files = readdirSync(src).filter((f) => f.endsWith(".wasm"));

if (files.length === 0) {
  console.warn("[copy-wasm] .wasmファイルが見つかりませんでした。web-ifcのバージョンを確認してください。");
  process.exit(0);
}

for (const file of files) {
  copyFileSync(join(src, file), join(dest, file));
  console.log(`[copy-wasm] copied ${file} -> public/`);
}

#!/usr/bin/env node
/**
 * Postinstall script: copies Tesseract.js worker assets into /public/tesseract/
 * so Next.js serves them as static files (required — must NOT be webpack-bundled).
 */
const fs = require("fs");
const path = require("path");

const destDir = path.join(__dirname, "..", "public", "tesseract");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const tesseractBase = path.dirname(require.resolve("tesseract.js/package.json"));

const filesToCopy = [
  {
    src: path.join(tesseractBase, "src", "worker-script", "node", "index.js"),
    dest: path.join(destDir, "tesseract-worker.min.js"),
    fallbacks: [
      path.join(tesseractBase, "dist", "worker.min.js"),
      path.join(tesseractBase, "dist", "worker.js"),
    ],
  },
  {
    src: path.join(tesseractBase, "src", "worker-script", "node", "tesseract-core.wasm.js"),
    dest: path.join(destDir, "tesseract-core.wasm.js"),
    fallbacks: [
      path.join(tesseractBase, "dist", "tesseract-core.wasm.js"),
    ],
  },
];

for (const { src, dest, fallbacks } of filesToCopy) {
  let source = src;
  if (!fs.existsSync(source)) {
    source = (fallbacks || []).find((f) => fs.existsSync(f));
  }
  if (source) {
    fs.copyFileSync(source, dest);
    console.log(`Copied: ${path.basename(source)} → public/tesseract/${path.basename(dest)}`);
  } else {
    console.warn(`Warning: could not find source for ${path.basename(dest)} — OCR worker may not load correctly.`);
  }
}

// Copy traineddata if present
const traindataLocations = [
  path.join(tesseractBase, "lang-data", "eng.traineddata.gz"),
  path.join(tesseractBase, "eng.traineddata.gz"),
];
const traindataDest = path.join(destDir, "eng.traineddata.gz");
const traindataSrc = traindataLocations.find((f) => fs.existsSync(f));
if (traindataSrc) {
  fs.copyFileSync(traindataSrc, traindataDest);
  console.log(`Copied: eng.traineddata.gz → public/tesseract/`);
} else {
  console.warn("Warning: eng.traineddata.gz not found — Tesseract will download it at runtime.");
}

console.log("Tesseract assets copy complete.");

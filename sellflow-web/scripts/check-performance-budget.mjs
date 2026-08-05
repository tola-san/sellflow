import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const manifest = JSON.parse(readFileSync("dist/.vite/manifest.json", "utf8"));
const entry = Object.values(manifest).find((chunk) => chunk.isEntry);

if (!entry) {
  throw new Error("Could not find the application entry in the Vite manifest.");
}

const initialFiles = new Set();

function collectInitialFiles(chunk) {
  if (chunk.file) initialFiles.add(chunk.file);
  for (const cssFile of chunk.css ?? []) initialFiles.add(cssFile);

  for (const importedSource of chunk.imports ?? []) {
    const importedChunk = manifest[importedSource];
    if (importedChunk) collectInitialFiles(importedChunk);
  }
}

collectInitialFiles(entry);

const sizes = [...initialFiles].map((file) => {
  const contents = readFileSync(`dist/${file}`);
  return {
    file,
    rawBytes: contents.byteLength,
    gzipBytes: gzipSync(contents).byteLength,
  };
});

const totals = sizes.reduce(
  (result, asset) => {
    const bucket = asset.file.endsWith(".css") ? "css" : "js";
    result[bucket] += asset.gzipBytes;
    return result;
  },
  { js: 0, css: 0 },
);

const budgets = {
  js: 190 * 1024,
  css: 30 * 1024,
};

const formatKiB = (bytes) => `${(bytes / 1024).toFixed(2)} KiB`;

console.table(
  sizes.map(({ file, rawBytes, gzipBytes }) => ({
    asset: file,
    raw: formatKiB(rawBytes),
    gzip: formatKiB(gzipBytes),
  })),
);

console.log(`Initial JavaScript (gzip): ${formatKiB(totals.js)} / ${formatKiB(budgets.js)}`);
console.log(`Initial CSS (gzip): ${formatKiB(totals.css)} / ${formatKiB(budgets.css)}`);

const failures = Object.entries(budgets)
  .filter(([type, budget]) => totals[type] > budget)
  .map(([type, budget]) => `${type.toUpperCase()} is ${formatKiB(totals[type] - budget)} over budget`);

if (failures.length > 0) {
  console.error(`Performance budget failed: ${failures.join("; ")}.`);
  process.exitCode = 1;
} else {
  console.log("Performance budget passed.");
}

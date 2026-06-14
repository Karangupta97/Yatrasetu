/**
 * Generates PNG icons for PWA manifest from the SVG source.
 * Run with: node generate-icons.js
 * Requires: sharp  (npm install sharp --save-dev)
 *
 * Usage (one-time, during setup):
 *   cd frontend && node generate-icons.js
 */

const fs = require("fs");
const path = require("path");

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUT_DIR = path.join(__dirname, "public", "icons");

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("sharp not found. Run: npm install sharp --save-dev");
    process.exit(1);
  }

  const svgPath = path.join(OUT_DIR, "icon.svg");
  const svgBuf  = fs.readFileSync(svgPath);

  for (const size of SIZES) {
    const out = path.join(OUT_DIR, `icon-${size}x${size}.png`);
    await sharp(svgBuf).resize(size, size).png().toFile(out);
    console.log(`✓ ${out}`);
  }
  console.log("Done.");
}

main().catch(console.error);

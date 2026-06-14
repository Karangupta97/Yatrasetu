import { createRequire } from "module";
import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);
const SIZES     = [72, 96, 128, 144, 152, 192, 384, 512];
const OUTDIR    = join(__dirname, "public", "icons");
const SVG       = readFileSync(join(OUTDIR, "icon.svg"));

async function trySharp() {
  try {
    const sharp = require("sharp");
    for (const size of SIZES) {
      await sharp(SVG).resize(size, size).png().toFile(join(OUTDIR, `icon-${size}x${size}.png`));
    }
    return true;
  } catch { return false; }
}

function tinyPng(r, g, b) {
  const { deflateSync } = require("zlib");
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) { let c = i; for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[i] = c; }
  const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = t[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const tb = Buffer.from(type,"ascii"); const len = Buffer.alloc(4); len.writeUInt32BE(data.length,0); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([tb,data])),0); return Buffer.concat([len,tb,data,crc]); };
  const sig  = Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr = chunk("IHDR", (() => { const b = Buffer.alloc(13); b.writeUInt32BE(1,0); b.writeUInt32BE(1,4); b[8]=8;b[9]=2; return b; })());
  const idat = chunk("IDAT", deflateSync(Buffer.from([0, r, g, b])));
  const iend = chunk("IEND", Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

const ok = await trySharp();
if (!ok) {
  const px = tinyPng(116, 142, 254); // #748efe — will be replaced by sharp when available
  for (const size of SIZES) writeFileSync(join(OUTDIR, `icon-${size}x${size}.png`), px);
}
console.log("Icons generated.");

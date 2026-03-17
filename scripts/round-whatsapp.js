const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");

const [inputArg, outputArg] = process.argv.slice(2);
const projectRoot = path.resolve(__dirname, "..");

const inputPath = inputArg
  ? path.resolve(process.cwd(), inputArg)
  : path.join(projectRoot, "src", "assets", "whatsapp.png");

const outputPath = outputArg
  ? path.resolve(process.cwd(), outputArg)
  : path.join(projectRoot, "src", "assets", "whatsapp-rounded.png");

async function main() {
  const base = sharp(inputPath).ensureAlpha();
  const meta = await base.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) throw new Error("Could not read image dimensions");

  const raw = await base.raw().toBuffer();
  const stride = 4;
  const alphaAt = (x, y) => raw[(y * w + x) * stride + 3];

  let rTop = null;
  for (let x = 0; x < w; x++) {
    if (alphaAt(x, 0) > 0) {
      rTop = x;
      break;
    }
  }

  let rLeft = null;
  for (let y = 0; y < h; y++) {
    if (alphaAt(0, y) > 0) {
      rLeft = y;
      break;
    }
  }

  const rCandidate = Math.min(rTop ?? Number.POSITIVE_INFINITY, rLeft ?? Number.POSITIVE_INFINITY);
  let r = Number.isFinite(rCandidate) ? rCandidate : Math.floor(Math.min(w, h) * 0.18);
  r = Math.max(1, Math.min(r, Math.floor(Math.min(w, h) / 2)));

  const svg = `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="white"/></svg>`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await sharp(inputPath)
    .ensureAlpha()
    .composite([{ input: Buffer.from(svg), blend: "dest-in" }])
    .png()
    .toFile(outputPath);

  process.stdout.write(
    JSON.stringify(
      { inputPath, outputPath, width: w, height: h, detected: { rTop, rLeft }, radius: r },
      null,
      2
    ) + "\n"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

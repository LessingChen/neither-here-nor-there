import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cities } from '../src/data/cities.js';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = path.resolve(webRoot, '../Visual Experiment/cities');
const brands = new Set(['coca-cola', 'moutai']);
const types = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};
const imagePattern = /\.(png|jpe?g|webp)$/i;

function resolveBottle(cityId, brand, file) {
  if (!brands.has(brand) || !file || file.includes('\0') || file.includes('/') || file.includes('\\')) return null;
  const city = cities.find((item) => item.id === cityId);
  if (!city) return null;
  const base = path.resolve(assetRoot, city.folder, brand);
  const full = path.resolve(base, file);
  if (path.basename(full) !== file || !full.startsWith(`${base}${path.sep}`)) return null;
  if (!imagePattern.test(full) || !fs.existsSync(full)) return null;
  const stat = fs.statSync(full);
  if (!stat.isFile()) return null;
  return { full, stat };
}

function serve(req, res, next) {
  const raw = req.url?.split('?')[0] ?? '';
  if (!raw.startsWith('/bottles/')) {
    next();
    return;
  }
  let pathname = raw;
  try {
    pathname = decodeURIComponent(raw);
  } catch {
    res.statusCode = 400;
    res.end();
    return;
  }
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 4 || parts[0] !== 'bottles') {
    res.statusCode = 404;
    res.end();
    return;
  }
  const resolved = resolveBottle(parts[1], parts[2], parts[3]);
  if (!resolved) {
    res.statusCode = 404;
    res.end();
    return;
  }
  const extension = path.extname(resolved.full).toLowerCase();
  res.statusCode = 200;
  res.setHeader('Content-Type', types[extension] || 'application/octet-stream');
  res.setHeader('Content-Length', resolved.stat.size);
  res.setHeader('Cache-Control', 'no-cache');
  fs.createReadStream(resolved.full).pipe(res);
}

function copyInto(outDir) {
  let copied = 0;
  for (const city of cities) {
    for (const brand of brands) {
      const source = path.join(assetRoot, city.folder, brand);
      if (!fs.existsSync(source)) continue;
      const destination = path.join(outDir, 'bottles', city.id, brand);
      fs.mkdirSync(destination, { recursive: true });
      for (const file of fs.readdirSync(source)) {
        if (file.startsWith('.') || !imagePattern.test(file)) continue;
        fs.copyFileSync(path.join(source, file), path.join(destination, file));
        copied += 1;
      }
    }
  }
  return copied;
}

export function bottlesPlugin() {
  return {
    name: 'serve-city-bottles',
    configureServer(server) {
      server.middlewares.use(serve);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serve);
    },
    writeBundle(outputOptions) {
      if (!outputOptions.dir) return;
      const copied = copyInto(outputOptions.dir);
      console.log(`copied ${copied} bottle images into ${outputOptions.dir}/bottles`);
    },
  };
}

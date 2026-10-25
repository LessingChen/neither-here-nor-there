import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cities } from '../src/data/cities.js';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = path.resolve(webRoot, '../Visual Experiment/cities');
const manifestPath = path.resolve(webRoot, 'src/data/assetManifest.json');
const brands = ['coca-cola', 'moutai'];
const imagePattern = /\.(png|jpe?g|webp)$/i;

export function scanAssets() {
  const slots = { 'coca-cola': {}, moutai: {} };
  const empty = [];

  for (const brand of brands) {
    for (const city of cities) {
      const relativeFolder = `cities/${city.folder}/${brand}`;
      const directory = path.join(assetRoot, city.folder, brand);
      let files = [];
      if (fs.existsSync(directory)) {
        files = fs
          .readdirSync(directory)
          .filter((file) => !file.startsWith('.') && imagePattern.test(file))
          .sort((a, b) => a.localeCompare(b, 'zh-Hant', { numeric: true }));
      }
      slots[brand][city.id] = {
        folder: relativeFolder,
        files,
      };
      if (files.length === 0) empty.push(relativeFolder);
    }
  }

  return { slots, empty };
}

function readPrevious() {
  if (!fs.existsSync(manifestPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    return {};
  }
}

function finiteOr(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function priorPresentation(previous, brand, cityId, file) {
  const files = previous?.slots?.[brand]?.[cityId]?.files ?? [];
  const found = files.find((item) => (typeof item === 'string' ? item === file : item?.file === file));
  if (!found || typeof found === 'string') {
    return { scale: 1, offsetX: 0, offsetY: 0, composite: 'matte' };
  }
  const scale = finiteOr(found.scale, 1);
  const offsetX = finiteOr(found.offsetX, 0);
  const offsetY = finiteOr(found.offsetY, finiteOr(found.translateY, 0));
  return {
    scale: scale > 0 ? scale : 1,
    offsetX,
    offsetY,
    composite: found.composite === 'transparent' ? 'transparent' : 'matte',
  };
}

export function writeManifest(scanned = scanAssets()) {
  const previous = readPrevious();
  const slots = { 'coca-cola': {}, moutai: {} };
  for (const brand of brands) {
    for (const [cityId, slot] of Object.entries(scanned.slots[brand])) {
      slots[brand][cityId] = {
        folder: slot.folder,
        files: slot.files.map((file) => ({
          file,
          ...priorPresentation(previous, brand, cityId, file),
        })),
      };
    }
  }
  const next = `${JSON.stringify({ slots }, null, 2)}\n`;
  const current = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, 'utf8') : '';
  if (current !== next) {
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, next);
  }
  return scanned;
}

function isMain() {
  return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isMain()) {
  const scanned = writeManifest();
  const filled = Object.values(scanned.slots).reduce(
    (total, brandSlots) => total + Object.values(brandSlots).filter((slot) => slot.files.length > 0).length,
    0,
  );
  const fileCount = Object.values(scanned.slots).reduce(
    (total, brandSlots) => total + Object.values(brandSlots).reduce((sum, slot) => sum + slot.files.length, 0),
    0,
  );
  console.log(`asset manifest: ${filled} filled slots, ${scanned.empty.length} empty, ${fileCount} images`);
  for (const folder of scanned.empty) console.log(`  empty  ${folder}`);
}

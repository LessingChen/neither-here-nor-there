import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cities } from '../src/data/cities.js';
import { brands } from '../src/data/brands.js';
import { copy } from '../src/data/copy.js';
import { assignDraw, buildReel, pickBottleFile, pickCity } from '../src/lib/pick.js';
import { scanAssets, writeManifest } from './sync-assets.mjs';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = path.resolve(webRoot, '../Visual Experiment/cities');
const failures = [];

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function mulberry32(seed) {
  let value = seed >>> 0;
  return function random() {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const approved = {
  'copy.projectTitle': 'NEITHER HERE NOR THERE',
  'copy.subtitle.zh': '跨文化品牌轉譯實驗',
  'copy.subtitle.en': 'A CROSS-CULTURAL BRAND TRANSLATION EXPERIMENT',
  'copy.disclaimer.zh': '本作品為虛構的藝術與設計研究項目，不代表相關品牌之立場或商業行為，亦不暗示任何品牌合作或背書。',
  'copy.disclaimer.en': 'This is a fictional art and design research project. It does not represent the views or commercial activities of the brands shown, nor imply any brand affiliation or endorsement.',
  'copy.language.zh': '繁體中文',
  'copy.language.en': 'ENGLISH',
  'copy.select.section.zh': '01 / 品牌選擇',
  'copy.select.section.en': '01 / BRAND SELECTION',
  'copy.select.heading.zh': '選擇一個品牌。',
  'copy.select.heading.en': 'CHOOSE A BRAND.',
  'copy.draw.heading.zh': '你將前往哪裡？',
  'copy.draw.heading.en': 'WHERE ARE YOU HEADED?',
  'copy.draw.status.zh': '正在分配目的地……',
  'copy.draw.status.en': 'ASSIGNING DESTINATION...',
  'copy.draw.welcome.zh': '歡迎來到',
  'copy.draw.welcome.en': 'WELCOME TO',
  'copy.result.page.zh': '轉譯結果頁',
  'copy.result.page.en': 'RESULT PAGE',
  'copy.result.next.zh': '前往下一站',
  'copy.result.next.en': 'NEXT DESTINATION',
  'copy.result.switchBrand.zh': '換個品牌',
  'copy.result.switchBrand.en': 'TRY ANOTHER BRAND',
  'copy.result.about.zh': '關於本作品',
  'copy.result.about.en': 'ABOUT THIS PROJECT',
  'copy.about.heading.zh': '關於這次轉譯',
  'copy.about.heading.en': 'ABOUT THIS TRANSLATION',
  'copy.about.close.zh': '返回結果',
  'copy.about.close.en': 'BACK TO RESULT',
  'copy.about.paragraphs.zh.0': '《Neither Here Nor There》（唔湯唔水）是一項關於品牌跨文化轉譯的思辨藝術實驗。觀眾選擇可口可樂或茅台，隨機前往一座城市，遇見一個既熟悉又陌生的品牌形象。',
  'copy.about.paragraphs.zh.1': '作品刻意以誇張、拼貼與錯置的手法，放大人們對不同文化的刻板印象，並將這些印象轉化為瓶身的形狀、材質與視覺符號。這些看似「本地化」的設計並不試圖準確呈現當地文化，而是提出一個問題：當品牌為了融入另一種文化而借用它的符號時，究竟是在理解文化，還是在複製對文化的想像？',
  'copy.about.paragraphs.zh.2': '所有轉譯結果均為本項目的虛構創作，與相關品牌的官方產品或商業合作無關。',
  'copy.about.paragraphs.en.0': 'Neither Here Nor There is a speculative art project exploring cross-cultural brand translation. Visitors choose Coca-Cola or Moutai and are randomly taken to a city, where they encounter a brand that feels both familiar and foreign.',
  'copy.about.paragraphs.en.1': 'Through deliberate exaggeration, collage, and cultural displacement, the project amplifies stereotypes and translates them into bottle forms, materials, and visual symbols. These seemingly “localized” designs are not intended as accurate representations of local cultures. Instead, they raise a question: when brands borrow cultural symbols to fit into another context, are they understanding that culture, or merely reproducing an imagined version of it?',
  'copy.about.paragraphs.en.2': "All translated designs are fictional creations for this project and are not affiliated with the brands' official products or commercial activities.",
  'brand.coca-cola.en': 'COCA-COLA',
  'brand.coca-cola.zh': '可口可樂',
  'brand.coca-cola.line.zh': '帶走你的可樂。',
  'brand.coca-cola.line.en': 'TAKE YOUR COCA-COLA WITH YOU.',
  'brand.moutai.en': 'MOUTAI',
  'brand.moutai.zh': '茅台',
  'brand.moutai.line.zh': '收下這份茅台禮。',
  'brand.moutai.line.en': 'ACCEPT THIS GIFT OF MOUTAI.',
};

function readPath(root, dotted) {
  return dotted.split('.').reduce((value, key) => value?.[key], root);
}

for (const [key, expected] of Object.entries(approved)) {
  const source = key.startsWith('brand.') ? { brand: Object.fromEntries(brands.map((brand) => [brand.id, brand])) } : { copy };
  const prefix = key.startsWith('brand.') ? key : key;
  assert(readPath(source, prefix) === expected, `copy mismatch: ${key}`);
}

const sydney = cities.find((city) => city.id === 'sydney');
assert(sydney?.zh === '悉尼' && sydney?.regionZh === '澳大利亞', 'Sydney must read 悉尼（澳大利亞）');
assert(sydney?.en === 'Sydney' && sydney?.regionEn === 'Australia', 'Sydney English label changed');
assert(!cities.some((city) => city.zh.includes('雪梨')), '雪梨 was substituted for 悉尼');
assert(cities.length === 24, `expected 24 cities, found ${cities.length}`);
assert(new Set(cities.map((city) => city.id)).size === 24, 'city ids are not unique');
assert(new Set(cities.map((city) => city.accent)).size === 24, 'accent colors are not unique');
assert(brands.map((brand) => brand.id).join() === 'coca-cola,moutai', 'brand ids changed');

for (const city of cities) {
  assert(fs.existsSync(path.join(assetRoot, city.folder)), `missing city folder ${city.folder}`);
  assert(/^#[0-9A-F]{6}$/.test(city.accent), `bad accent for ${city.id}`);
  assert(city.zh && city.en && city.regionZh && city.regionEn, `incomplete label for ${city.id}`);
}

const scanned = writeManifest(scanAssets());
const written = JSON.parse(fs.readFileSync(path.join(webRoot, 'src/data/assetManifest.json'), 'utf8'));
const sampleFit = written.slots['coca-cola'].beijing.files[0];
assert(
  typeof sampleFit?.file === 'string'
    && Number.isFinite(sampleFit.scale)
    && Number.isFinite(sampleFit.offsetX)
    && Number.isFinite(sampleFit.offsetY),
  'bottle manifest is missing per-asset scale, offsetX, and offsetY',
);
for (const brand of brands) {
  for (const city of cities) {
    const slot = scanned.slots[brand.id][city.id];
    const directory = path.join(assetRoot, city.folder, brand.id);
    const onDisk = fs.existsSync(directory)
      ? fs.readdirSync(directory).filter((file) => !file.startsWith('.') && /\.(png|jpe?g|webp)$/i.test(file))
      : [];
    assert(slot.files.length === onDisk.length, `${brand.id}/${city.id} count ${slot.files.length} != disk ${onDisk.length}`);
    for (const file of onDisk) {
      assert(slot.files.includes(file), `${brand.id}/${city.id} missing ${file} in manifest`);
      assert(fs.existsSync(path.join(directory, file)), `${file} listed but absent`);
    }
  }
}

const random = mulberry32(20261023);
const counts = Object.fromEntries(cities.map((city) => [city.id, 0]));
for (let index = 0; index < 4800; index += 1) {
  const city = pickCity(cities, { random });
  counts[city.id] += 1;
}
for (const city of cities) {
  assert(counts[city.id] > 80, `${city.id} under-drawn (${counts[city.id]})`);
}

const excluded = pickCity(cities, { excludeId: 'paris', random: mulberry32(7) });
assert(excluded.id !== 'paris', 'excluded city was still drawn');
let excludedHits = 0;
const excludeRandom = mulberry32(11);
for (let index = 0; index < 400; index += 1) {
  if (pickCity(cities, { excludeId: 'paris', random: excludeRandom }).id === 'paris') excludedHits += 1;
}
assert(excludedHits === 0, 'next-destination exclusion failed');

for (const brand of brands) {
  for (const city of cities) {
    const files = scanned.slots[brand.id][city.id].files;
    const seen = new Set();
    const draws = files.length > 1 ? 40 : 4;
    for (let index = 0; index < draws; index += 1) {
      const file = pickBottleFile(files, null, mulberry32(index + city.order * 17 + brand.id.length));
      if (files.length === 0) {
        assert(file === null, `${brand.id}/${city.id} should have no file`);
      } else {
        assert(files.includes(file), `${brand.id}/${city.id} returned a foreign file ${file}`);
        seen.add(file);
      }
    }
    if (files.length > 1) {
      assert(seen.size > 1, `${brand.id}/${city.id} did not vary across files`);
    }
  }
}

const repeatFiles = ['a.png', 'b.png', 'c.png'];
const avoided = new Set();
for (let index = 0; index < 60; index += 1) {
  avoided.add(pickBottleFile(repeatFiles, 'a.png', mulberry32(index + 99)));
}
assert(!avoided.has('a.png'), 'same-city redraw repeated the avoided file');
assert(avoided.has('b.png') && avoided.has('c.png'), 'same-city redraw ignored alternates');

for (const city of cities) {
  const reel = buildReel(cities, city.id, { random: mulberry32(city.order * 13) });
  assert(reel.at(-1).id === city.id, `reel for ${city.id} did not land on the chosen city`);
  assert(reel.length === 26, `reel length for ${city.id}`);
  for (let index = 1; index < reel.length; index += 1) {
    assert(reel[index].id !== reel[index - 1].id, `adjacent duplicate in ${city.id} reel`);
  }
}

const emptySlots = {
  'coca-cola': new Set(['marrakech']),
  moutai: new Set(['dubai', 'lagos', 'paris']),
};
for (const brand of brands) {
  const seen = new Set();
  for (let index = 0; index < 400; index += 1) {
    const draw = assignDraw({
      cityList: cities,
      filesFor: (id) => scanned.slots[brand.id][id].files,
      random: mulberry32(index + brand.id.length * 97),
    });
    assert(draw.city && draw.file, `${brand.id} draw landed on an empty slot`);
    assert(!emptySlots[brand.id].has(draw.city?.id), `${brand.id} still draws ${draw.city?.id}`);
    seen.add(draw.city.id);
  }
  assert(seen.size > 10, `${brand.id} draw collapsed to too few cities`);
}

const sample = assignDraw({
  cityList: cities,
  filesFor: (id) => scanned.slots['coca-cola'][id].files,
  excludeCityId: 'beijing',
  random: mulberry32(3),
});
assert(sample.city.id !== 'beijing', 'assignDraw ignored the excluded city');
if (scanned.slots['coca-cola'][sample.city.id].files.length > 0) {
  assert(
    scanned.slots['coca-cola'][sample.city.id].files.includes(sample.file),
    'assignDraw returned a file from another city',
  );
}

const tricky = scanned.slots['coca-cola'].edinburgh.files.find((file) => file.includes('×'));
assert(tricky, 'expected an Edinburgh filename with a multiply sign');
const roundTrip = decodeURIComponent(encodeURIComponent(tricky));
assert(roundTrip === tricky, 'filename encoding round-trip failed');

if (failures.length > 0) {
  console.error(`validation failed (${failures.length})`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}

console.log('validation passed');
console.log(`cities ${cities.length}; brands ${brands.length}`);
for (const brand of brands) {
  for (const city of cities) {
    const slot = scanned.slots[brand.id][city.id];
    const mark = slot.files.length === 0 ? 'MISSING' : String(slot.files.length).padStart(2, ' ');
    console.log(`${mark}  ${brand.id.padEnd(10)} ${city.id.padEnd(16)} ${slot.folder}`);
  }
}

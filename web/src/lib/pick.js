export function pickCity(cityList, { excludeId, random = Math.random } = {}) {
  let pool = cityList;
  if (excludeId) {
    const filtered = cityList.filter((city) => city.id !== excludeId);
    if (filtered.length > 0) pool = filtered;
  }
  if (pool.length === 0) return null;
  return pool[Math.floor(random() * pool.length)];
}

export function pickBottleFile(files, avoidFile, random = Math.random) {
  if (!files || files.length === 0) return null;
  let pool = files;
  if (avoidFile && files.length > 1 && files.includes(avoidFile)) {
    pool = files.filter((file) => file !== avoidFile);
  }
  return pool[Math.floor(random() * pool.length)];
}

export function assignDraw({
  cityList,
  filesFor,
  excludeCityId = null,
  avoid = null,
  random = Math.random,
}) {
  const available = cityList.filter((city) => (filesFor(city.id) ?? []).length > 0);
  const city = pickCity(available, { excludeId: excludeCityId, random });
  if (!city) return { city: null, file: null };
  const files = filesFor(city.id) ?? [];
  const avoidFile = avoid && avoid.cityId === city.id ? avoid.file : null;
  const file = pickBottleFile(files, avoidFile, random);
  return { city, file };
}

export function buildReel(cityList, targetId, { steps = 26, random = Math.random } = {}) {
  const target = cityList.find((city) => city.id === targetId);
  if (!target) {
    throw new Error(`Unknown destination: ${targetId}`);
  }
  const reel = [];
  let lastId = null;
  while (reel.length < steps - 1) {
    const next = cityList[Math.floor(random() * cityList.length)];
    if (next.id === lastId) continue;
    reel.push(next);
    lastId = next.id;
  }
  if (reel.length > 0 && reel[reel.length - 1].id === target.id) {
    const replacement = cityList.find((city) => city.id !== target.id);
    reel[reel.length - 1] = replacement;
  }
  reel.push(target);
  return reel;
}

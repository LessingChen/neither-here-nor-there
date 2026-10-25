import manifest from '../data/assetManifest.json';

export function getSlot(brandId, cityId) {
  return manifest.slots?.[brandId]?.[cityId] ?? { folder: '', files: [] };
}

export function slotFileNames(brandId, cityId) {
  return (getSlot(brandId, cityId).files ?? [])
    .map((item) => (typeof item === 'string' ? item : item?.file))
    .filter(Boolean);
}

function finiteOr(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function presentationFor(slot, file) {
  const entry = (slot.files ?? []).find((item) => (
    typeof item === 'string' ? item === file : item?.file === file
  ));
  if (!entry || typeof entry === 'string') {
    return { scale: 1, offsetX: 0, offsetY: 0, composite: 'matte' };
  }
  const scale = finiteOr(entry.scale, 1);
  return {
    scale: scale > 0 ? scale : 1,
    offsetX: finiteOr(entry.offsetX, 0),
    offsetY: finiteOr(entry.offsetY, finiteOr(entry.translateY, 0)),
    composite: entry.composite === 'transparent' ? 'transparent' : 'matte',
  };
}

export function bottleFromFile(brandId, cityId, file) {
  const slot = getSlot(brandId, cityId);
  const presentation = presentationFor(slot, file);
  if (!file) {
    return {
      file: null,
      url: null,
      folder: slot.folder,
      ...presentation,
    };
  }
  return {
    file,
    url: `/bottles/${cityId}/${brandId}/${encodeURIComponent(file)}`,
    folder: slot.folder,
    ...presentation,
  };
}

export const brands = [
  {
    id: 'coca-cola',
    en: 'COCA-COLA',
    zh: '可口可樂',
    line: {
      zh: '帶走你的可樂。',
      en: 'TAKE YOUR COCA-COLA WITH YOU.',
    },
  },
  {
    id: 'moutai',
    en: 'MOUTAI',
    zh: '茅台',
    line: {
      zh: '收下這份茅台禮。',
      en: 'ACCEPT THIS GIFT OF MOUTAI.',
    },
  },
];

export function getBrand(id) {
  return brands.find((brand) => brand.id === id) ?? null;
}

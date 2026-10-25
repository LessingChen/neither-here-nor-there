// Display names follow the artist's city list. Sydney is 悉尼, not 雪梨.
// `folder` is the existing shelf directory under Visual Experiment/cities.
export const cities = [
  { id: 'beijing', order: 1, zh: '北京', en: 'Beijing', regionZh: '中國', regionEn: 'China', accent: '#A54236', folder: '01-beijing-北京' },
  { id: 'kyoto', order: 2, zh: '京都', en: 'Kyoto', regionZh: '日本', regionEn: 'Japan', accent: '#6D7355', folder: '02-kyoto-京都' },
  { id: 'tokyo', order: 3, zh: '東京', en: 'Tokyo', regionZh: '日本', regionEn: 'Japan', accent: '#315F9C', folder: '03-tokyo-东京' },
  { id: 'seoul', order: 4, zh: '首爾', en: 'Seoul', regionZh: '韓國', regionEn: 'South Korea', accent: '#397C78', folder: '04-seoul-首尔' },
  { id: 'bangkok', order: 5, zh: '曼谷', en: 'Bangkok', regionZh: '泰國', regionEn: 'Thailand', accent: '#A77A25', folder: '05-bangkok-曼谷' },
  { id: 'hanoi', order: 6, zh: '河內', en: 'Hanoi', regionZh: '越南', regionEn: 'Vietnam', accent: '#4D7058', folder: '06-hanoi-河内' },
  { id: 'ulaanbaatar', order: 7, zh: '烏蘭巴托', en: 'Ulaanbaatar', regionZh: '蒙古', regionEn: 'Mongolia', accent: '#55758F', folder: '07-ulaanbaatar-乌兰巴托' },
  { id: 'mumbai', order: 8, zh: '孟買', en: 'Mumbai', regionZh: '印度', regionEn: 'India', accent: '#A95F3D', folder: '08-mumbai-孟买' },
  { id: 'istanbul', order: 9, zh: '伊斯坦堡', en: 'Istanbul', regionZh: '土耳其', regionEn: 'Turkey', accent: '#287985', folder: '09-istanbul-伊斯坦布尔' },
  { id: 'dubai', order: 10, zh: '杜拜', en: 'Dubai', regionZh: '阿聯酋', regionEn: 'United Arab Emirates', accent: '#947249', folder: '10-dubai-迪拜' },
  { id: 'cairo', order: 11, zh: '開羅', en: 'Cairo', regionZh: '埃及', regionEn: 'Egypt', accent: '#8F682F', folder: '11-cairo-开罗' },
  { id: 'marrakech', order: 12, zh: '馬拉喀什', en: 'Marrakech', regionZh: '摩洛哥', regionEn: 'Morocco', accent: '#A64D3A', folder: '12-marrakech-马拉喀什' },
  { id: 'lagos', order: 13, zh: '拉各斯', en: 'Lagos', regionZh: '尼日利亞', regionEn: 'Nigeria', accent: '#5B608D', folder: '13-lagos-拉各斯' },
  { id: 'paris', order: 14, zh: '巴黎', en: 'Paris', regionZh: '法國', regionEn: 'France', accent: '#6E7481', folder: '14-paris-巴黎' },
  { id: 'london', order: 15, zh: '倫敦', en: 'London', regionZh: '英格蘭', regionEn: 'England', accent: '#904B45', folder: '15-london-伦敦' },
  { id: 'edinburgh', order: 16, zh: '愛丁堡', en: 'Edinburgh', regionZh: '蘇格蘭', regionEn: 'Scotland', accent: '#52695F', folder: '16-edinburgh-爱丁堡' },
  { id: 'moscow', order: 17, zh: '莫斯科', en: 'Moscow', regionZh: '俄羅斯', regionEn: 'Russia', accent: '#65568B', folder: '17-moscow-莫斯科' },
  { id: 'copenhagen', order: 18, zh: '哥本哈根', en: 'Copenhagen', regionZh: '丹麥', regionEn: 'Denmark', accent: '#A07835', folder: '18-copenhagen-哥本哈根' },
  { id: 'helsinki', order: 19, zh: '赫爾辛基', en: 'Helsinki', regionZh: '芬蘭', regionEn: 'Finland', accent: '#477687', folder: '19-helsinki-赫尔辛基' },
  { id: 'mexico-city', order: 20, zh: '墨西哥城', en: 'Mexico City', regionZh: '墨西哥', regionEn: 'Mexico', accent: '#9A5269', folder: '20-mexico-city-墨西哥城' },
  { id: 'havana', order: 21, zh: '哈瓦那', en: 'Havana', regionZh: '古巴', regionEn: 'Cuba', accent: '#367C77', folder: '21-havana-哈瓦那' },
  { id: 'rio-de-janeiro', order: 22, zh: '里約熱內盧', en: 'Rio de Janeiro', regionZh: '巴西', regionEn: 'Brazil', accent: '#47794D', folder: '22-rio-里约热内卢' },
  { id: 'new-york', order: 23, zh: '紐約', en: 'New York', regionZh: '美國', regionEn: 'United States', accent: '#96751F', folder: '23-new-york-纽约' },
  { id: 'sydney', order: 24, zh: '悉尼', en: 'Sydney', regionZh: '澳大利亞', regionEn: 'Australia', accent: '#2D7898', folder: '24-sydney-悉尼' },
];

export function getCity(id) {
  return cities.find((city) => city.id === id) ?? null;
}

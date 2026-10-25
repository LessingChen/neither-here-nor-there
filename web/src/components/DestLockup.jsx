export function DestLockup({ city, lang }) {
  const region = lang === 'zh' ? city.regionZh : city.regionEn;

  return (
    <div className="city-block" style={{ '--city': city.accent }}>
      <div className="city-pair">
        <p className="city-zh" lang="zh-Hant">{city.zh}</p>
        <p className="city-en">{city.en}</p>
      </div>
      <p className="region-name">{region}</p>
    </div>
  );
}

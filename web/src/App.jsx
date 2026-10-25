import { useEffect, useState } from 'react';
import { cities } from './data/cities.js';
import { getBrand } from './data/brands.js';
import { assignDraw } from './lib/pick.js';
import { bottleFromFile, slotFileNames } from './lib/assets.js';
import { useIdleReset } from './hooks/useIdleReset.js';
import { useLanguage } from './hooks/useLanguage.js';
import { Frame } from './components/Frame.jsx';
import { BrandSelect } from './components/BrandSelect.jsx';
import { DestinationDraw } from './components/DestinationDraw.jsx';
import { ResultView } from './components/ResultView.jsx';

function readDevEntry() {
  const blank = { screen: 'select', brandId: null, city: null, bottle: null, nonce: 0 };
  if (!import.meta.env.DEV) return blank;
  const params = new URLSearchParams(window.location.search);
  const brandId = params.get('brand');
  if (brandId !== 'coca-cola' && brandId !== 'moutai') return blank;
  const requestedId = params.get('city');
  const pool = requestedId ? cities.filter((city) => city.id === requestedId) : cities;
  if (pool.length === 0) return blank;
  const { city, file } = assignDraw({
    cityList: pool,
    filesFor: (id) => slotFileNames(brandId, id),
  });
  if (!city) return blank;
  return {
    screen: requestedId ? 'result' : 'draw',
    brandId,
    city,
    bottle: bottleFromFile(brandId, city.id, file),
    nonce: 1,
  };
}

export default function App() {
  const [lang, setLang] = useLanguage();
  const [entry] = useState(readDevEntry);
  const [screen, setScreen] = useState(entry.screen);
  const [brandId, setBrandId] = useState(entry.brandId);
  const [city, setCity] = useState(entry.city);
  const [bottle, setBottle] = useState(entry.bottle);
  const [nonce, setNonce] = useState(entry.nonce);
  const [about, setAbout] = useState(false);

  useEffect(() => {
    if (!bottle?.url) return undefined;
    const image = new Image();
    image.src = bottle.url;
    return undefined;
  }, [bottle]);

  function returnHome() {
    setBrandId(null);
    setCity(null);
    setBottle(null);
    setAbout(false);
    setScreen('select');
  }

  useIdleReset(screen !== 'select', returnHome);

  function beginDraw(nextBrandId, { excludeCityId = null, avoid = null } = {}) {
    const { city: nextCity, file } = assignDraw({
      cityList: cities,
      filesFor: (id) => slotFileNames(nextBrandId, id),
      excludeCityId,
      avoid,
    });
    if (!nextCity) return;
    setBrandId(nextBrandId);
    setCity(nextCity);
    setBottle(bottleFromFile(nextBrandId, nextCity.id, file));
    setNonce((value) => value + 1);
    setAbout(false);
    setScreen('draw');
  }

  const brand = getBrand(brandId);

  return (
    <Frame lang={lang} setLang={setLang}>
      {screen === 'select' && (
        <BrandSelect lang={lang} onChoose={(id) => beginDraw(id)} />
      )}
      {screen === 'draw' && city && (
        <DestinationDraw
          key={nonce}
          lang={lang}
          city={city}
          onDone={() => setScreen('result')}
        />
      )}
      {screen === 'result' && brand && city && (
        <ResultView
          lang={lang}
          brand={brand}
          city={city}
          bottle={bottle}
          about={about}
          onCloseAbout={() => setAbout(false)}
          onNext={() => beginDraw(brandId, {
            excludeCityId: city.id,
            avoid: { cityId: city.id, file: bottle?.file ?? null },
          })}
          onSwitch={returnHome}
          onAbout={() => setAbout(true)}
        />
      )}
    </Frame>
  );
}

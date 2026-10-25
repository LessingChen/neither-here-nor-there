import { useEffect, useRef } from 'react';
import { copy } from '../data/copy.js';
import { Arrow, Exchange, Plus } from './Marks.jsx';
import { BottleFigure } from './BottleFigure.jsx';
import { DestLockup } from './DestLockup.jsx';
import { AboutView } from './AboutView.jsx';

export function ResultView({ lang, brand, city, bottle, about = false, onNext, onSwitch, onAbout, onCloseAbout }) {
  const aboutButtonRef = useRef(null);
  const wasAbout = useRef(false);

  useEffect(() => {
    if (wasAbout.current && !about) {
      aboutButtonRef.current?.focus({ preventScroll: true, focusVisible: false });
    }
    wasAbout.current = about;
  }, [about]);

  const alt = lang === 'zh' ? `${brand.zh}，${city.zh}` : `${brand.en}, ${city.en}`;

  return (
    <div className={about ? 'page-stage is-about' : 'page-stage'}>
      <div className="page-track">
        <section
          className="screen result-screen"
          data-screen="result"
          data-city={city.id}
          data-brand={brand.id}
          data-file={bottle?.file ?? ''}
          aria-labelledby="result-heading"
          aria-hidden={about ? true : undefined}
          inert={about ? true : undefined}
        >
          <aside className="result-rail">
            <p className="rail-index">{copy.result.section}</p>
          </aside>
          <div className="result-figure">
            <BottleFigure
              key={`${brand.id}-${city.id}-${bottle?.file ?? 'missing'}`}
              bottle={bottle}
              alt={alt}
            />
          </div>
          <div className="result-copy">
            <div className="result-text">
              <h1 id="result-heading" className="result-line">
                {brand.line[lang].replaceAll('-', '\u2011')}
              </h1>
              <DestLockup city={city} lang={lang} />
            </div>
            <nav className="result-actions">
              <button type="button" className="text-action" onClick={onNext}>
                <span>{copy.result.next[lang]}</span>
                <Arrow />
              </button>
              <button type="button" className="text-action" onClick={onSwitch}>
                <span>{copy.result.switchBrand[lang]}</span>
                <Exchange />
              </button>
              <button type="button" className="text-action" ref={aboutButtonRef} onClick={onAbout}>
                <span>{copy.result.about[lang]}</span>
                <Plus />
              </button>
            </nav>
          </div>
        </section>
        <AboutView lang={lang} active={about} onClose={onCloseAbout} />
      </div>
    </div>
  );
}

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cities } from '../data/cities.js';
import { copy } from '../data/copy.js';
import { buildReel } from '../lib/pick.js';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';
import { DestLockup } from './DestLockup.jsx';

const CENTER = 2;

function paintReel(track, offset) {
  if (!track) return;
  track.style.transform = `translate3d(0, calc((${CENTER} - ${offset}) * var(--row)), 0)`;
  const items = track.children;
  for (let index = 0; index < items.length; index += 1) {
    const distance = Math.abs(index - offset);
    const active = distance < 0.55;
    const item = items[index];
    item.style.opacity = String(Math.max(0.16, 1 - distance * 0.46));
    item.style.color = active ? item.dataset.accent : '';
    item.classList.toggle('is-active', active);
  }
}

export function DestinationDraw({ lang, city, onDone }) {
  const reduced = usePrefersReducedMotion();
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const reel = useMemo(() => buildReel(cities, city.id), [city.id]);
  const [phase, setPhase] = useState(() => (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'welcome' : 'spin'
  ));

  useLayoutEffect(() => {
    if (phase === 'spin') paintReel(trackRef.current, offsetRef.current);
  });

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let welcomeTimer = 0;

    const finish = (delay) => {
      welcomeTimer = window.setTimeout(() => {
        if (!cancelled) onDoneRef.current();
      }, delay);
    };

    if (reduced) {
      setPhase('welcome');
      finish(1200);
      return () => {
        cancelled = true;
        window.clearTimeout(welcomeTimer);
      };
    }

    setPhase('spin');
    const start = performance.now();
    const duration = 3600;
    const last = reel.length - 1;

    const tick = (now) => {
      if (cancelled) return;
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const offset = eased * last;
      offsetRef.current = offset;
      paintReel(trackRef.current, offset);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      setPhase('welcome');
      finish(1600);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(welcomeTimer);
    };
  }, [reduced, reel]);

  const cityName = lang === 'zh' ? city.zh : city.en;
  const region = lang === 'zh' ? city.regionZh : city.regionEn;
  const liveText = phase === 'welcome'
    ? `${copy.draw.welcome[lang]} ${cityName}, ${region}`
    : copy.draw.status[lang];

  return (
    <section className="screen draw-screen" data-screen="draw" data-phase={phase} aria-labelledby="draw-heading">
      <p className="kicker">{copy.draw.section}</p>
      <h1 id="draw-heading" className="display">{copy.draw.heading[lang]}</h1>
      <p className={phase === 'welcome' ? 'status is-welcome' : 'status'}>
        {phase === 'welcome' ? copy.draw.welcome[lang] : copy.draw.status[lang]}
      </p>
      <div className="reel-slot">
        {phase === 'spin' ? (
          <div className="reel-window" aria-hidden="true">
            <div className="reel-track" ref={trackRef}>
              {reel.map((item, index) => (
                <div className="reel-item" key={`${item.id}-${index}`} data-accent={item.accent}>
                  <span className="reel-bar" />
                  <span className="reel-index">{String(item.order).padStart(2, '0')}</span>
                  <span className={lang === 'zh' ? 'reel-label city-zh' : 'reel-label city-en'}>
                    {lang === 'zh' ? item.zh : item.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <DestLockup city={city} lang={lang} />
        )}
      </div>
      <p className="sr-only" aria-live="polite">{liveText}</p>
    </section>
  );
}

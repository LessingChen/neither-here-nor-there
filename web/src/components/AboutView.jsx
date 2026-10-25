import { useEffect, useRef } from 'react';
import { copy } from '../data/copy.js';
import { Arrow } from './Marks.jsx';

const PROJECT_TITLE = 'Neither Here Nor There';

function renderAboutParagraph(paragraph) {
  if (!paragraph.startsWith(PROJECT_TITLE)) return paragraph;
  return (
    <>
      <em>{PROJECT_TITLE}</em>
      {paragraph.slice(PROJECT_TITLE.length)}
    </>
  );
}

export function AboutView({ lang, active, onClose }) {
  const headingRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) return undefined;
    headingRef.current?.focus({ preventScroll: true });
    const onKey = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <section
      className="screen about-screen"
      data-screen="about"
      aria-labelledby="about-heading"
      aria-hidden={active ? undefined : true}
      inert={active ? undefined : true}
    >
      <div className="about-statement">
        <h1 id="about-heading" className="about-heading" tabIndex={-1} ref={headingRef}>
          {copy.about.heading[lang]}
        </h1>
        <div className="about-body">
          {copy.about.paragraphs[lang].map((paragraph) => (
            <p key={paragraph}>{renderAboutParagraph(paragraph)}</p>
          ))}
        </div>
        <button type="button" className="about-return" onClick={() => onCloseRef.current()}>
          <Arrow />
          <span>{copy.about.close[lang]}</span>
        </button>
      </div>
    </section>
  );
}

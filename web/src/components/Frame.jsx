import { copy } from '../data/copy.js';

export function Frame({ lang, setLang, children }) {
  return (
    <div className="frame" lang={lang === 'zh' ? 'zh-Hant' : 'en'}>
      <header className="frame-header">
        <div className="lockup">
          <p className="project-title">{copy.projectTitle}</p>
          <p className="project-sub">{copy.subtitle[lang]}</p>
        </div>
        <button type="button" className="lang-toggle" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}>
          <span className={lang === 'zh' ? 'is-on' : ''} lang="zh-Hant">{copy.language.zh}</span>
          <span className="lang-slash" aria-hidden="true"> / </span>
          <span className={lang === 'en' ? 'is-on' : ''} lang="en">{copy.language.en}</span>
        </button>
      </header>
      <div className="frame-body">
        {children}
      </div>
      <footer className="frame-footer">
        <p className="disclaimer">{copy.disclaimer[lang]}</p>
      </footer>
    </div>
  );
}

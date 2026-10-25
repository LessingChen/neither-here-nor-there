import { brands } from '../data/brands.js';
import { copy } from '../data/copy.js';
import { Arrow } from './Marks.jsx';

export function BrandSelect({ lang, onChoose }) {
  return (
    <section className="screen brand-screen" data-screen="select" aria-labelledby="select-heading">
      <p className="kicker">{copy.select.section[lang]}</p>
      <h1 id="select-heading" className="display">{copy.select.heading[lang]}</h1>
      <div className="brand-list">
        {brands.map((brand) => (
          <button
            key={brand.id}
            type="button"
            className="brand-choice"
            data-brand={brand.id}
            onClick={() => onChoose(brand.id)}
          >
            <span className="brand-en">{brand.en}</span>
            <span className="brand-zh" lang="zh-Hant">{brand.zh}</span>
            <Arrow />
          </button>
        ))}
      </div>
    </section>
  );
}

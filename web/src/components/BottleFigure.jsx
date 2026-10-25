import { useState } from 'react';

export function BottleFigure({ bottle, alt }) {
  const [failed, setFailed] = useState(false);
  const missing = !bottle?.url || failed;
  const expected = bottle?.file ? `${bottle.folder}/${bottle.file}` : bottle?.folder;
  const scale = bottle?.scale ?? 1;
  const offsetX = bottle?.offsetX ?? 0;
  const offsetY = bottle?.offsetY ?? 0;

  return (
    <figure className="bottle-frame">
      {missing ? (
        <div className="bottle-missing" role="img" aria-label={alt}>
          <p>{expected}</p>
        </div>
      ) : (
        <img
          src={bottle.url}
          alt={alt}
          draggable="false"
          decoding="async"
          style={{ transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})` }}
          onError={() => setFailed(true)}
        />
      )}
    </figure>
  );
}

import { useEffect, useState } from 'react';

function query() {
  return window.matchMedia('(prefers-reduced-motion: reduce)');
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => query().matches);

  useEffect(() => {
    const media = query();
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

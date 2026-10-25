import { useEffect, useRef } from 'react';

export const IDLE_RESET_MS = 120_000;

export function useIdleReset(active, onIdle, delay = IDLE_RESET_MS) {
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    if (!active) return undefined;
    let last = Date.now();
    let fired = false;
    const bump = () => {
      last = Date.now();
    };
    const tick = () => {
      if (fired || Date.now() - last < delay) return;
      fired = true;
      onIdleRef.current();
    };
    const events = ['pointerdown', 'keydown'];
    events.forEach((type) => window.addEventListener(type, bump, { passive: true }));
    const interval = window.setInterval(tick, 1000);
    return () => {
      events.forEach((type) => window.removeEventListener(type, bump));
      window.clearInterval(interval);
    };
  }, [active, delay]);
}

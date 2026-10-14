/**
 * BrandLoader — the logo mark inside a drawn arc, shown while a page settles.
 *
 * Timing is deliberately clamped: it is never visible for less than ~420ms
 * (which reads as a flicker) and never more than 1s (which would hold someone up
 * — this page gets opened by tapping a phone against an NFC card). Anyone with
 * prefers-reduced-motion skips it entirely.
 */

import { useEffect, useState } from 'react';

const MIN_HOLD = 420;
const MAX_HOLD = 1000;

export default function BrandLoader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      setHidden(true);
      return undefined;
    }

    let cancelled = false;
    const timers = [];

    const hide = () => {
      if (!cancelled) setHidden(true);
    };

    timers.push(
      window.setTimeout(() => {
        if (document.readyState === 'complete') hide();
        else window.addEventListener('load', hide, { once: true });
      }, MIN_HOLD)
    );

    timers.push(window.setTimeout(hide, MAX_HOLD));

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      window.removeEventListener('load', hide);
    };
  }, []);

  return (
    <div className={`loader${hidden ? ' hidden' : ''}`} aria-hidden="true">
      <div className="loader-mark">
        <svg className="loader-mark__ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="loader-mark__track" cx="50" cy="50" r="46" />
          <circle className="loader-mark__arc" cx="50" cy="50" r="46" />
        </svg>
        <img className="loader-mark__logo" src="logo.png" alt="" width="256" height="256" />
      </div>
    </div>
  );
}

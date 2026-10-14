/**
 * DotField — an interactive dot lattice on a 2D canvas.
 *
 * Design intent: crisp geometry, restrained motion. The field drifts on a slow
 * diagonal wave when idle and brightens around the pointer. No glow, no blur,
 * no colour drift — the "life" comes from the lattice itself, which is why it
 * reads as engineered rather than generated.
 *
 * Performance notes:
 *  - Dots are batched into a handful of Path2D buckets keyed by brightness, so
 *    a frame costs ~18 fills instead of ~2,000 individual ones.
 *  - DPR is capped at 2.
 *  - The loop parks itself when the tab is hidden.
 *  - prefers-reduced-motion renders one static lattice and never starts rAF.
 */

import { useEffect, useRef } from 'react';

const INK = '238, 241, 246';

const SPACING = 26; // px between dot centres
const INFLUENCE = 150; // pointer radius in px
const LEVELS = 9; // brightness buckets
const BASE_R = 1.1; // idle dot radius
const HOT_R = 1.9; // radius once a dot is noticeably lit
const IDLE_ALPHA = 0.07;
const WAVE_ALPHA = 0.075;
const PEAK_ALPHA = 0.52;
const MAX_ALPHA = 0.95;

const makeBuckets = () =>
  Array.from({ length: LEVELS }, () => [new Path2D(), new Path2D()]);

export default function DotField({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 1;
    let height = 1;
    let raf = 0;
    let last = 0;
    let clock = 0;
    let buckets = makeBuckets();

    const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, heat: 0, on: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const build = () => {
      buckets = makeBuckets();

      const cx = width / 2;
      const cy = height / 2;
      const maxDist = Math.hypot(cx, cy) || 1;

      for (let y = SPACING * 0.5; y < height; y += SPACING) {
        for (let x = SPACING * 0.5; x < width; x += SPACING) {
          // Dissolve the lattice toward the corners so it never tiles to a hard edge.
          const ed = Math.hypot(x - cx, y - cy) / maxDist;
          const edge = ed <= 0.34 ? 1 : Math.max(0, 1 - (ed - 0.34) / 0.62);
          if (edge <= 0.01) continue;

          let alpha = IDLE_ALPHA;
          if (!reduce) {
            alpha += WAVE_ALPHA * (0.5 + 0.5 * Math.sin((x + y) * 0.012 - clock * 0.6));
          }
          alpha *= edge;

          let hot = 0;
          if (!reduce && pointer.heat > 0.001) {
            const d = Math.hypot(x - pointer.x, y - pointer.y);
            if (d < INFLUENCE) {
              const t = 1 - d / INFLUENCE;
              hot = t * t * (3 - 2 * t) * pointer.heat;
              alpha += hot * PEAK_ALPHA * edge;
            }
          }

          const level = Math.min(LEVELS - 1, Math.floor((alpha / MAX_ALPHA) * LEVELS));
          if (level < 0) continue;

          const radius = hot > 0.35 ? HOT_R : BASE_R;
          const path = buckets[level][hot > 0.35 ? 1 : 0];
          path.moveTo(x + radius, y);
          path.arc(x, y, radius, 0, Math.PI * 2);
        }
      }
    };

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      for (let level = 0; level < LEVELS; level += 1) {
        const alpha = ((level + 0.5) / LEVELS) * MAX_ALPHA;
        ctx.fillStyle = `rgba(${INK}, ${alpha.toFixed(3)})`;
        ctx.fill(buckets[level][0]);
        ctx.fill(buckets[level][1]);
      }
    };

    const frame = now => {
      raf = 0;

      if (document.hidden) {
        last = 0;
        return;
      }

      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      clock += dt;

      const targetHeat = pointer.on ? 1 : 0;
      pointer.heat += (targetHeat - pointer.heat) * (1 - Math.exp(-dt / 0.18));

      if (pointer.on) {
        const k = 1 - Math.exp(-dt / 0.1);
        pointer.x += (pointer.tx - pointer.x) * k;
        pointer.y += (pointer.ty - pointer.y) * k;
      }

      build();
      paint();
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || reduce) return;
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = event => {
      const rect = canvas.getBoundingClientRect();
      const nx = event.clientX - rect.left;
      const ny = event.clientY - rect.top;
      if (!pointer.on) {
        pointer.x = nx;
        pointer.y = ny;
      }
      pointer.tx = nx;
      pointer.ty = ny;
      pointer.on = true;
      wake();
    };

    const onPointerLeave = () => {
      pointer.on = false;
      wake();
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const onResize = () => {
      resize();
      if (reduce) {
        build();
        paint();
      } else {
        wake();
      }
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas);

    if (!reduce) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerdown', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
      document.addEventListener('visibilitychange', onVisibility);
    }

    resize();
    build();
    paint();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={`dotfield${className ? ` ${className}` : ''}`} aria-hidden="true" />;
}

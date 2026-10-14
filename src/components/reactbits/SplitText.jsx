/**
 * SplitText — a dependency-free port of React Bits' Split Text
 * https://reactbits.dev/text-animations/split-text
 *
 * The original relies on GSAP (`gsap`, `gsap/SplitText`, `@gsap/react`) which is far
 * heavier than a single staggered reveal warrants. This keeps the same prop surface
 * and the same character/word split behaviour, but drives the animation with CSS
 * transitions + an IntersectionObserver instead.
 *
 * Behavioural notes:
 *  - `delay` is milliseconds between each unit (same unit as the original).
 *  - `duration` is seconds (same unit as the original).
 *  - Reduced-motion users get the final state with no animation.
 *  - The visual letters are aria-hidden and the whole line carries an aria-label,
 *    so screen readers read the sentence, not the letters.
 */

import { Fragment, useEffect, useRef, useState } from 'react';

const EASE = {
  'power1.out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'power2.out': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  'power3.out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'power4.out': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  'expo.out': 'cubic-bezier(0.19, 1, 0.22, 1)',
};

const SplitText = ({
  text = '',
  className = '',
  tag: Tag = 'span',
  splitType = 'chars',
  delay = 45,
  duration = 0.85,
  ease = 'power3.out',
  from = { opacity: 0, y: 38, blur: 8 },
  to = { blur: 0 },
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  textAlign,
  onAnimationComplete,
}) => {
  const ref = useRef(null);
  const doneRef = useRef(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [visible, setVisible] = useState(false);

  // Reveal only once the webfont is in, otherwise the letters reflow mid-animation.
  useEffect(() => {
    if (!document.fonts) {
      setFontsReady(true);
      return undefined;
    }
    if (document.fonts.status === 'loaded') {
      setFontsReady(true);
      return undefined;
    }
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !fontsReady) return undefined;

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      doneRef.current = true;
      onAnimationComplete?.();
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        setVisible(true);
        window.setTimeout(() => {
          if (doneRef.current) return;
          doneRef.current = true;
          onAnimationComplete?.();
        }, duration * 1000 + delay * 4);
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fontsReady, threshold, rootMargin, duration, delay, onAnimationComplete]);

  const words = String(text).split(' ');
  const byWord = splitType.includes('word');
  let index = -1;

  return (
    <Tag
      ref={ref}
      className={`split-parent${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      aria-label={text}
      style={{
        textAlign,
        '--stagger': `${delay}ms`,
        '--dur': `${duration}s`,
        '--ease': EASE[ease] || EASE['power3.out'],
        '--from-op': from.opacity ?? 0,
        '--from-y': `${from.y ?? 38}px`,
        '--from-blur': `${from.blur ?? 8}px`,
      }}
    >
      {words.map((word, wordIndex) => {
        const units = byWord ? [word] : Array.from(word);
        return (
          // The separating space lives OUTSIDE .split-word: that span is
          // white-space: nowrap, so a trailing space inside it would collapse
          // and the words would run together.
          <Fragment key={`${word}-${wordIndex}`}>
            <span className="split-word">
              <span aria-hidden="true" className="split-word__inner">
                {units.map(unit => {
                  index += 1;
                  return (
                    <span className="split-unit" style={{ '--i': index }} key={index}>
                      {unit}
                    </span>
                  );
                })}
              </span>
            </span>
            {wordIndex < words.length - 1 ? ' ' : null}
          </Fragment>
        );
      })}
    </Tag>
  );
};

export default SplitText;

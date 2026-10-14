# Third-party components

## React Bits — https://reactbits.dev

| File | Source | Modifications |
|---|---|---|
| `Magnet.jsx` | [`src/content/Animations/Magnet`](https://github.com/DavidHDev/react-bits/tree/main/src/content/Animations/Magnet) | Attribution header only |
| `SplitText.jsx` | [`src/content/TextAnimations/SplitText`](https://github.com/DavidHDev/react-bits/tree/main/src/content/TextAnimations/SplitText) | GSAP replaced with CSS transitions + IntersectionObserver; same prop surface |

React Bits' `Aurora` and `ClickSpark` were used in an earlier iteration of the landing page and
have been removed — the animated shader background read as generic. The landing now uses a
masked studio portrait instead.

**License:** MIT + Commons Clause Condition v1.0 — Copyright (c) 2026 David Haz.

> You may use this Software, including for any commercial purpose, so long as you do not
> sell, sublicense, or redistribute the components themselves — whether alone, in a bundle,
> or as a ported version.

These components are used **as part of this website only**. They are not sold, sublicensed
or redistributed as components. The full upstream notice:

```
MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, and distribute the Software
as part of an application, website, or product, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, so long as you do
not sell, sublicense, or redistribute the components themselves-whether alone, in a
bundle, or as a ported version.

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 21st.dev — https://21st.dev

The glass action-row and status-pill patterns follow the component design language
published on 21st (React + Tailwind + shadcn/ui). They are re-implemented here against
this site's own CSS tokens rather than installed through the shadcn registry, so nothing
from 21st is redistributed. `tailwindcss` is installed so that registry components can be
dropped in later.

## Fonts

Fraunces, Inter and JetBrains Mono are served from Google Fonts under the SIL Open Font License.

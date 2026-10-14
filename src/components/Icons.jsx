/**
 * Inline icon set — stroke-based, 24x24, currentColor.
 * Kept inline so the landing needs zero icon-font/network requests.
 */

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const MailIcon = props => (
  <svg {...base} {...props}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3 7 8.15 5.6a1.5 1.5 0 0 0 1.7 0L21 7" />
  </svg>
);

export const PhoneIcon = props => (
  <svg {...base} {...props}>
    <path d="M4.2 3.5h3.1l1.6 4-2 1.3a12.5 12.5 0 0 0 5.8 5.8l1.3-2 4 1.6v3.1a1.8 1.8 0 0 1-2 1.8A16.5 16.5 0 0 1 2.4 5.5a1.8 1.8 0 0 1 1.8-2Z" />
  </svg>
);

export const VCardIcon = props => (
  <svg {...base} {...props}>
    <path d="M15 19v-1.6a3.4 3.4 0 0 0-3.4-3.4H6.4A3.4 3.4 0 0 0 3 17.4V19" />
    <circle cx="9" cy="7.5" r="3.2" />
    <path d="M17.5 8v6" />
    <path d="M20.5 11h-6" />
  </svg>
);

export const CvIcon = props => (
  <svg {...base} {...props}>
    <path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8Z" />
    <path d="M14 3v5h5" />
    <path d="M12 11.5v6" />
    <path d="m9.5 15 2.5 2.5L14.5 15" />
  </svg>
);

export const FacebookIcon = props => (
  <svg {...base} {...props}>
    <path d="M17 2.5h-2.6A4.4 4.4 0 0 0 10 6.9v2.6H7.5v3.6H10v8h3.6v-8h2.6l.7-3.6h-3.3V7.2c0-.6.5-1.1 1.1-1.1H17Z" />
  </svg>
);

export const InstagramIcon = props => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="3.7" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const PortfolioIcon = props => (
  <svg {...base} {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M3 9.5h18" />
    <path d="M9 9.5V20" />
  </svg>
);

export const ChevronIcon = props => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="m9 5 7 7-7 7" />
  </svg>
);

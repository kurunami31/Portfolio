import Magnet from './components/reactbits/Magnet.jsx';
import SplitText from './components/reactbits/SplitText.jsx';

import {
  MailIcon,
  PhoneIcon,
  VCardIcon,
  CvIcon,
  FacebookIcon,
  InstagramIcon,
  PortfolioIcon,
  ChevronIcon,
} from './components/Icons.jsx';

import { PROFILE } from './data/profile.js';

const ACTIONS = [
  {
    key: 'email',
    label: 'Email',
    meta: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    aria: `Email ${PROFILE.email}`,
    Icon: MailIcon,
  },
  {
    key: 'call',
    label: 'Call',
    meta: PROFILE.phoneLabel,
    href: `tel:${PROFILE.phone}`,
    aria: `Call ${PROFILE.phoneLabel}`,
    Icon: PhoneIcon,
  },
  {
    key: 'vcard',
    label: 'Save Contact',
    meta: 'vCard · add to phone',
    href: 'christopher.vcf',
    download: `${PROFILE.fullName}.vcf`,
    aria: 'Save my contact card to your phone',
    primary: true,
    Icon: VCardIcon,
  },
  {
    key: 'cv',
    label: 'Download CV',
    meta: 'Résumé · print to PDF',
    href: 'cv/',
    aria: 'Open my CV',
    Icon: CvIcon,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    meta: PROFILE.facebookHandle,
    href: PROFILE.facebook,
    external: true,
    aria: 'My Facebook profile, opens in a new tab',
    Icon: FacebookIcon,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    meta: PROFILE.instagramHandle,
    href: PROFILE.instagram,
    external: true,
    aria: 'My Instagram profile, opens in a new tab',
    Icon: InstagramIcon,
  },
  {
    key: 'portfolio',
    label: 'Full Portfolio',
    meta: 'Projects · about · writing',
    href: 'portfolio/',
    aria: 'Open the full portfolio',
    Icon: PortfolioIcon,
  },
];

export default function App() {
  return (
    <div className="landing">
      <div className="grain" aria-hidden="true" />

      <main className="card">
        <header className="card__head">
          <img
            className="portrait"
            src="christopher.webp"
            alt=""
            width="600"
            height="600"
            fetchPriority="high"
            decoding="async"
          />

          <p className="status">
            <span className="status__dot" aria-hidden="true" />
            Open to opportunities
          </p>

          <h1 className="name">
            <span className="name__line">
              <SplitText text={PROFILE.firstName} delay={38} duration={0.75} />
            </span>
            <span className="name__line name__line--surname">
              <SplitText
                text={PROFILE.surname}
                delay={86}
                duration={0.85}
                from={{ opacity: 0, y: 24, blur: 9 }}
              />
            </span>
          </h1>

          <p className="role">
            {PROFILE.role}
            <span className="role__sep" aria-hidden="true">
              /
            </span>
            {PROFILE.school}
            <span className="role__sep" aria-hidden="true">
              /
            </span>
            {PROFILE.place}
          </p>
        </header>

        <ul className="actions">
          {ACTIONS.map(({ key, label, meta, href, download, external, aria, primary, Icon }) => (
            <li key={key}>
              <Magnet
                padding={60}
                magnetStrength={3.5}
                maxOffset={6}
                style={{ display: 'block', width: '100%' }}
              >
                <a
                  className={`action${primary ? ' action--primary' : ''}`}
                  href={href}
                  aria-label={aria}
                  {...(download ? { download } : {})}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="action__icon">
                    <Icon />
                  </span>
                  <span className="action__text">
                    <span className="action__label">{label}</span>
                    <span className="action__meta">{meta}</span>
                  </span>
                  <ChevronIcon className="action__chevron" />
                </a>
              </Magnet>
            </li>
          ))}
        </ul>

        <footer className="card__foot">
          <span>
            © {new Date().getFullYear()} {PROFILE.surname}
          </span>
          <span>{PROFILE.place}</span>
        </footer>
      </main>
    </div>
  );
}

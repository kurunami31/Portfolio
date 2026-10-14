/**
 * Generates the printable QR assets for the NFC card.
 *
 *   npm run qr
 *
 * Outputs (repo root, mirrored into dist/ by vite.config.js):
 *   qr.svg       — vector, use this for printing at any size
 *   qr-1024.png  — 1024px raster fallback
 *
 * Error correction is set to H (~30% recoverable) because a card gets handled,
 * scuffed and partly covered by a fingertip.
 */

import QRCode from 'qrcode';
import { resolve } from 'node:path';

const TARGET = 'https://kurunami31.github.io/Portfolio/';

const root = resolve(import.meta.dirname, '..');

const options = {
  errorCorrectionLevel: 'H',
  margin: 2,
  color: { dark: '#07080cff', light: '#ffffffff' },
};

await QRCode.toFile(resolve(root, 'qr.svg'), TARGET, { ...options, type: 'svg' });

await QRCode.toFile(resolve(root, 'qr-1024.png'), TARGET, {
  ...options,
  type: 'png',
  width: 1024,
});

console.log(`QR generated for ${TARGET}`);
console.log('  qr.svg');
console.log('  qr-1024.png');

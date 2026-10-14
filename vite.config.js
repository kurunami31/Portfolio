import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;

/**
 * Files that are NOT built by Vite: the blog, case studies, CV, the full
 * portfolio page, the printable QR sheet and all shared assets. They are
 * plain HTML/CSS/JS served as-is, so we just mirror them into dist/ after
 * the React landing has been built.
 */
const STATIC_PATHS = [
  'blog',
  'case-studies',
  'cv',
  'portfolio',
  'qr',
  '404.html',
  '.nojekyll',
  'style.css',
  'script.js',
  'sw.js',
  'manifest.json',
  'sitemap.xml',
  'robots.txt',
  'christopher.vcf',
  'qr.svg',
  'qr-1024.png',
  'favicon.svg',
  'favicon-32.png',
  'favicon-192.png',
  'favicon-512.png',
  'apple-touch-icon.png',
  'logo.png',
  'christopher.webp',
  'og-image.webp',
  'codebyterts-logo.gif',
  'fnahs-logo.png',
  'deis-logo.png',
];

function copyStaticPages() {
  return {
    name: 'copy-static-pages',
    apply: 'build',
    closeBundle() {
      const out = resolve(root, 'dist');
      for (const item of STATIC_PATHS) {
        const from = resolve(root, item);
        if (!existsSync(from)) continue;
        cpSync(from, resolve(out, item), { recursive: true });
      }
    },
  };
}

export default defineConfig({
  base: '/Portfolio/',
  plugins: [react(), tailwindcss(), copyStaticPages()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
  },
});

// Social preview cards (Open Graph images), rendered at build time.
// 1200×630 PNG, the size LinkedIn, Mastodon, and others expect.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const root = process.cwd();
const font = (weight: 400 | 700) =>
  readFileSync(join(root, `node_modules/@fontsource/figtree/files/figtree-latin-${weight}-normal.woff`));
const icon = `data:image/svg+xml;base64,${readFileSync(join(root, 'public/app-icon.svg')).toString('base64')}`;

const DOTS = ['#3352CC', '#7FA3E8', '#3E9A6A', '#E9B949', '#E8823A', '#D9606A'];

export interface Card { eyebrow: string; title: string; footer?: string; }

export async function renderCard({ eyebrow, title, footer = 'seuraphotos.app' }: Card): Promise<Uint8Array> {
  const size = title.length > 60 ? 54 : title.length > 36 ? 64 : 76;
  const node = {
    type: 'div',
    props: {
      style: { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: '#FFFFFF', fontFamily: 'Figtree', padding: '72px 80px 56px' },
      children: [
        { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: 64, flex: 1 }, children: [
          { type: 'img', props: { src: icon, width: 220, height: 220, style: { borderRadius: 48, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' } } },
          { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }, children: [
            { type: 'div', props: { style: { fontSize: 26, fontWeight: 700, letterSpacing: 2, color: '#5E5E5E', textTransform: 'uppercase' }, children: eyebrow } },
            { type: 'div', props: { style: { fontSize: size, fontWeight: 700, lineHeight: 1.12, color: '#1B1B1B', letterSpacing: -1 }, children: title } },
          ] } },
        ] } },
        { type: 'div', props: { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [
          { type: 'div', props: { style: { fontSize: 30, color: '#3352CC', fontWeight: 700 }, children: footer } },
          { type: 'div', props: { style: { display: 'flex', gap: 12 }, children: DOTS.map((c) => ({ type: 'div', props: { style: { width: 22, height: 22, borderRadius: 11, background: c } } })) } },
        ] } },
      ],
    },
  };
  const svg = await satori(node as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Figtree', data: font(400), weight: 400, style: 'normal' },
      { name: 'Figtree', data: font(700), weight: 700, style: 'normal' },
    ],
  });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

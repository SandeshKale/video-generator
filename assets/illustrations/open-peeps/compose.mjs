// Compose a static Open Peeps SVG: pose (body) + hair + face + facial hair + accessory, recoloured.
// import { peep } from '../open-peeps/compose.mjs'; peep({ pose:'standing/PointingFingerBW', hair:'ShortCurly', face:'Smile', facialHair:'Goatee', accessory:'GlassRound', stroke:'#1d1d24', bg:'#fffaf1' })
// pose is "<standing|sitting|bust>/<Name>"; omit pose for a head-only bust. viewBox 850x1200 (same as react-peeps).
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname, rd = (p) => fs.readFileSync(dir + p + '.svgfrag', 'utf8');
export function peep({ pose, hair, face, facialHair, accessory, stroke = '#000000', bg = '#ffffff' }) {
  const fill = (s) => s.replaceAll('{{stroke}}', stroke).replaceAll('{{bg}}', bg), part = (k, n) => (n ? fill(rd(k + '/' + n)) : '');
  const body = pose ? fill(rd('pose-' + pose)) : '';
  const head = `<g transform="translate(225 0)"><g>${part('hair', hair)}</g><g transform="translate(159 186)">${part('face', face)}</g><g transform="translate(123 338)">${part('facialHair', facialHair)}</g><g transform="translate(47 241)">${part('accessories', accessory)}</g></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1200">${body}${head}</svg>`;
}
export const doodle = (name, ink = '#000000', accent = '#FF5678') => fs.readFileSync(dir + '../open-doodles/' + name + 'Doodle.svg', 'utf8').replaceAll('{{ink}}', ink).replaceAll('{{accent}}', accent);

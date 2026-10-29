import { cpSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
rmSync(new URL('../out/', import.meta.url), { recursive: true, force: true });
mkdirSync('out', { recursive: true });
cpSync('portfolio-static', 'out', { recursive: true });
writeFileSync('out/.nojekyll', '');
console.log('Portfolio static export ready in out/');

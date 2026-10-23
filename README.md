# Personal Portfolio

Next.js portfolio, deployed to GitHub Pages:
https://raku-rin.github.io/Personal-Portifolio/

## Local development

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Deployment

Push changes to `main` to build and publish the website automatically.
GitHub repository Settings → Pages → Source must be set to **GitHub Actions**.

The deployment sets `GITHUB_PAGES=true` to export static files into `out/`,
and `NEXT_PUBLIC_BASE_PATH=/Personal-Portifolio` for routes and public assets.
Local development uses the root path by default.

## Cloudflare Workers

This portfolio uses Workers Static Assets with a Next.js static export.
The checked-in `wrangler.jsonc` deploys to `personal-portifolio` and builds
the website automatically, so the existing dashboard deploy command can stay:

```sh
npx wrangler deploy
```

Leave the dashboard Build command empty; Wrangler runs `pnpm run build:cloudflare`.
That script exports the website into `out/` at the domain root, even if GitHub
Pages environment variables are present. No OpenNext adapter or service binding
is needed. GitHub Pages continues to use its own build environment and base path.

To check the Cloudflare build locally without publishing:

```sh
pnpm exec wrangler deploy --dry-run
```

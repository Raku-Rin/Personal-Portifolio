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

/** Prefix public assets when the site is hosted in a repository subdirectory. */
export function assetPath(path: string) {
  return path.startsWith('/') && !path.startsWith('//')
    ? `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`
    : path
}

/** Encode each path segment so spaces/special chars in /public filenames work in img/video src */
export function publicMediaSrc(path: string): string {
  if (!path.startsWith('/')) return path
  return path
    .split('/')
    .map((seg) => (seg === '' ? '' : encodeURIComponent(seg)))
    .join('/')
}

// Empty/unset in a production build means "same origin" - nginx proxies /api
// and /uploads to the backend. Dev keeps the direct localhost default.
const cmsUrl =
  ((import.meta.env.VITE_CMS_URL as string | undefined) ?? '').replace(/\/$/, '') ||
  (import.meta.env.DEV ? 'http://localhost:4001' : '')

/** CMS uploads live on the API. Website files in /public stay as-is. */
export function mediaUrl(src: string) {
  if (!src) return src
  if (src.startsWith('/uploads/')) return `${cmsUrl}${src}`
  return src
}

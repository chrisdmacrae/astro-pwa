import type { AstroGlobal } from "astro"
import type { Route } from "./router"

export const createPageRoutesFromGlob = async (pages: ReturnType<AstroGlobal['glob']>): Promise<Route[]> => {
  if (!pages) return []

  const pageInstances = await pages
  return pageInstances
    .filter(p => p !== undefined && p.url !== undefined)
    .map(page => ({
      pattern: page.url!
        .replace(/\[[.]*(.*?)\]/, (match: string, m1: string) => m1 ? `:${m1}` : match),
      name: page.file
        .replace(/^.*?src\/pages/, '')
        .replace(/index.astro$/, '')
        .replace(/.astro$/, '')
        .replace(/\/$/, (_1: string, _2: string, original: string) => {
          return original.length === 1 ? original : ''
        })
    }))
    .reverse()
}

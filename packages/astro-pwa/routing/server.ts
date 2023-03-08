import type { AstroGlobal, AstroInstance } from "astro"
import type { MapStore } from "nanostores"
import type { Route, DehydratedRouter } from "./types"

export type ServerRouterStores<T extends Record<string, MapStore> | undefined> = T

export type ServerRouteConfig = {
  routes: Route[]
}

export const createDehydratedRouter = async (astro: AstroGlobal, config: ServerRouteConfig): Promise<DehydratedRouter> => {
  const routes = config?.routes
  const requestData = astro.request.headers.get('__astro-data') ?? '{}'
  const dehydratedRouter: DehydratedRouter = JSON.parse(requestData)
  const data = dehydratedRouter.data || {}
  
  return {
    path: astro.url.pathname,
    params: astro.params,
    url: astro.url,
    routes: routes,
    data: data
  }
}

export const createPageRoutesFromGlob = async (pages: AstroInstance[] | Promise<AstroInstance[]>): Promise<Route[]> => {
  if (!pages) return []

  const pageInstances = await pages
  const fileBase = [process.cwd(), 'src/pages'].join('/')
  return pageInstances
    .filter(p => p !== undefined && p.url !== undefined)
    .map(page => ({
      pattern: page.url!
        .replace(/\[[.]*(.*?)\]/, (match, m1) => m1 ? `:${m1}` : match),
      name: page.file
        .replace(fileBase, '')
        .replace(/index.astro$/, '')
        .replace(/.astro$/, '')
    }))
    .reverse()
}
import type { AstroGlobal, AstroInstance } from "astro"
import type { MapStore } from "nanostores"
import { join } from "path"
import { getStoreRegistry } from "../store"
import type { Route, DehydratedRouter } from "./types"

export type ServerRouterStores<T extends Record<string, MapStore> | undefined> = T

export type ServerRouteConfig = {
  routes: () => Route[] | Promise<Route[]>
}

export const createDehydratedRouter = async (astro: AstroGlobal, config: ServerRouteConfig): Promise<DehydratedRouter> => {
  const routes = config?.routes ? await config?.routes() : []
  const stores = getStoreRegistry().get()
  const requestData = astro.request.headers.get('__astro-data')

  let data = requestData ? JSON.parse(requestData) : {}
  if (stores) {
    data = Object.values(stores).reduce((data, store) => {
      if (store && !data[store.name]) {
        data[store.name] = store.get()
      }

      return data
    }, data)
  }

  Object.keys(data).forEach(name => {
    const store = stores[name]

    if (store) store.set(data[name])
  })
  
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
  const fileBase = join(process.cwd(), 'src/pages')
  return pageInstances
    .filter(p => p !== undefined && p.url !== undefined)
    .map(page => ({
      pattern: page.url!
        .replace(/\[[.]*(.*?)\]/, (match, m1) => m1 ? `:${m1}` : match),
      name: page.file
        .replace(fileBase, '')
        .replace(/\/index.astro$/, '')
        .replace(/.astro$/, '')
    }))
    .reverse()
}
import type { AstroGlobal } from "astro"
import type { MapStore } from "nanostores"
import { getClientStoreData } from "../stores/persistence"
import type { Route, DehydratedRouter, RouterConfig } from "./types"

export type ServerRouterStores<T extends Record<string, MapStore> | undefined> = T

export type RouteConfig = RouterConfig & {
  routes: Route[]
}

export const createDehydratedRouter = async (astro: AstroGlobal, { routes, ...config }: RouteConfig): Promise<DehydratedRouter> => {
  const clientStoreData = config.output === "server" ? getClientStoreData(astro.request) : undefined
  const dehydratedRouter = clientStoreData ?? {} as DehydratedRouter
  const data = dehydratedRouter.data || {}

  return {
    path: astro.url.pathname,
    params: astro.params,
    url: astro.url,
    routes: routes,
    config: config,
    data: data
  }
}

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

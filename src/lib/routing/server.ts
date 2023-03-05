import type { AstroGlobal, AstroInstance } from "astro"
import type { MapStore } from "nanostores"
import { join } from "path"
import type { Store } from "../store"
import type { Route, RouteConfig, Router } from "./types"

export type ServerRouterStores<T extends Record<string, MapStore> | undefined> = T

export type ServerRouterConfig = {
  routes: () => Route[] | Promise<Route[]>
  stores?: Store[]
}

export type ServerRouter<T extends Record<string, MapStore> | undefined> = Router & {
  stores?: T
  dehydrate: () => RouteConfig
}

export const createPageRoutes = async (pages: AstroInstance[] | Promise<AstroInstance[]>): Promise<Route[]> => {
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

export const createRouter = async <T extends Record<string, MapStore> | undefined>(astro: AstroGlobal, config: ServerRouterConfig): Promise<ServerRouter<T>> => {  
  const routes = config?.routes ? await config?.routes() : []
  const currentRoute = routes.find(route => 
    astro.url.pathname === route.pattern.toString() || 
    astro.url.pathname.includes(route.pattern.toString().replace(/\:.*/, ''))
  )

  return {
    path: currentRoute?.pattern.toString() || '',
    route: currentRoute?.name || '',
    routes: routes.map(route => route.name),
    push: (href: string) => astro.redirect(href, 302),
    redirect: (href: string) => astro.redirect(href, 302),
    stores: config?.stores?.reduce((stores, store) => {
      if (stores) {
        stores[store.name] = store
      }

      return stores
    }, {} as T),
    dehydrate: function(): RouteConfig {
      let data = {}
      if (config?.stores !== undefined) {
        data = Object.keys(config!.stores).reduce((data, name) => {
          const store = config.stores?.find(store => store.name === name)

          if (store) {
            data[name] = store.get()
          }

          return data
        }, {} as Record<string, any>)
      }
      
      return {
        path: astro.url.pathname,
        params: astro.params,
        url: astro.url,
        routes: routes,
        data: data
      }
    }
  }
}
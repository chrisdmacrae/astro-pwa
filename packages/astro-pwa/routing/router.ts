import type { Params } from "astro"
import { map } from "nanostores"
import { createRouter as createNanoRouter, Pattern } from "@nanostores/router"
import { isSSR } from "../ssr/isSsr"
import { dehydrateStores } from "../stores/hydration"
import { getClientStoreRegistry } from "../stores/clientStoreRegistry"
import type { Store } from "../stores/store"
import { getDehydratedData, sendClientStoreData } from "../session/temporary"

export const routerStore = map<Router>()

export const useRouter = () => routerStore.get()

export type Router = {
  path: string
  route: string
  params: Params
  routes: Route[]
  stores: Store[]
  push: (href: string, as: string) => void
  redirect: (href: string) => void
  dehydrate: () => DehydratedRouter
}

export type Route<P = Pattern<any>> = {
  name: string
  pattern: string | P
}

export type DehydratedRouter = {
  path: string
  params: Params
  routes: Route[]
}

export const createRouter = (dehydratedRouter: DehydratedRouter): Router => {
  const routes = dehydratedRouter?.routes.reduce((routes, route) => {
    routes[route.name] = route.pattern

    return routes
  }, {} as Record<string, string | Pattern<any>>) || {}
  const router = createNanoRouter(routes, { links: false })

  const push = (href: string) => router.open(new URL(href).pathname)
  const redirect = (href: string) => router.open(new URL(href).pathname, true)
  const update = () => {
    const updatedData = router.get()
    const currentData = routerStore.get()

    if (updatedData && currentData.path !== updatedData?.path) {
      routerStore.set({
        ...currentData,
        path: updatedData!.path,
        route: updatedData!.route
      })
    }
  }

  router.subscribe((routeChange) => {
    const router = routerStore.get()
    const isNewRoute = router.path && routeChange && routeChange?.path !== router.path

    if (isNewRoute && !isSSR) {
      update()
      getRoute(routeChange.path, router)
    }
  })


  if (!isSSR) {
    // We handle a clicks for valid routes as a SPA route
    document.addEventListener('click', (e) => {
      const el = e.target as HTMLAnchorElement

      if (el.tagName === 'A' && el.href) {
        const shouldCSR = Object.keys(routes).find(key => {
          return el.href.includes(key)
        })

        if (shouldCSR) {
          e.preventDefault()

          push(el.href)
        }
      }
    })
  }

  // The router is too stupid to know what to do at init
  router.open(dehydratedRouter?.path)

  // Initialize first state of router
  const data = router.get()
  routerStore.set({
    path: data!.path,
    route: data!.route,
    params: data!.params,
    routes: dehydratedRouter.routes,
    push,
    redirect,
    get stores() {
      const storeRegistry = getClientStoreRegistry()

      if (!storeRegistry) return []

      return storeRegistry
    },
    dehydrate: () => {
      const router = routerStore.get()
      const dehydratedRouter: DehydratedRouter = {
        path: router.path,
        params: router.params,
        routes: router.routes
      }

      return dehydratedRouter
    }
  })

  return routerStore.get()
}

const getRoute = async (href: string, router: Router) => {
  const dehydratedData = getDehydratedData()
  const dehydratedStores = dehydrateStores(router.stores)

  const page = await sendClientStoreData(href, { ...dehydratedData, data: dehydratedStores})
  const body = await page.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(body, 'text/html')
  const oldEl = document.getElementById('__astro')
  const newEl = doc.getElementById('__astro')

  let importedEl
  if (oldEl && newEl) {
    importedEl = document.importNode(newEl, true)
  }

  if (!oldEl || !importedEl) return

  oldEl.replaceWith(importedEl)
  hydrateScripts(Array.from(document.head.querySelectorAll('script')))
  hydrateScripts(Array.from(importedEl.querySelectorAll('script')))
}

export const hydrateScripts = (scripts: HTMLScriptElement[]) => {
  scripts.forEach(script => {
    const el = document.createElement('script')

    if (script.textContent) el.textContent = script.textContent
    Array.from(script.attributes).forEach(attr => {
      el.setAttribute(attr.name, attr.value)
    })

    script.replaceWith(el)
  })
}

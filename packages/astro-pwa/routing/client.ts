import type { DehydratedRouter, Router } from "./types"
import { createRouter as createNanoRouter, Pattern } from "@nanostores/router"
import { map, MapStore } from "nanostores"
import { isSSR } from "../ssr/isSsr"
import { dehydrateStores } from "../stores/hydration"
import { getClientStoreRegistry } from "../stores/clientStoreRegistry"

export const routerStore = map<Router>()

export const createRouter = (dehydratedRouter: DehydratedRouter): MapStore<Router> => {
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
    routes: router.routes.map(route => route[0]),
    config: dehydratedRouter.config,
    get stores() {
      const storeRegistry = getClientStoreRegistry()

      if (!storeRegistry) return []

      return storeRegistry
    },
    push,
    redirect
  })

  return routerStore
}

export const getDehydratedRouter = (document: Document = window.document) => {
  const dataEl = document.getElementById('__astro-data')

  if (!dataEl) return

  return JSON.parse(dataEl.textContent || '{}') as DehydratedRouter
}

const getRoute = async (href: string, router: Router) => {
  const dehydratedRouter = getDehydratedRouter() || {}
  const dehydratedStores = dehydrateStores(router.stores)
  const isServer = router.config.output === "server"
  const headers = isServer
    ? {
      '__astro-data': JSON.stringify({
        ...dehydratedRouter,
        data: dehydratedStores
      })
    } : undefined

    const page = await fetch(href, {
    headers: headers
  })
  const body = await page.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(body, 'text/html')
  const oldEl = document.getElementById('__astro')
  const newEl = doc.getElementById('__astro')

  document.head.replaceWith(doc.head)

  let importedEl
  if (oldEl && newEl) {
    importedEl = document.importNode(newEl, true)
    oldEl.replaceWith(importedEl)
  }

  if (!importedEl) return

  const scripts = importedEl.querySelectorAll('script')
  scripts.forEach(script => {
    const el = document.createElement('script')

    if (script.textContent) el.textContent = script.textContent
    Array.from(script.attributes).forEach(attr => {
      el.setAttribute(attr.name, attr.value)
    })

    script.replaceWith(el)
  })
}
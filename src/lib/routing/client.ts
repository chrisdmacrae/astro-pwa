import type { DehydratedRouter, Router } from "./types"
import { createRouter as createNanoRouter, Pattern } from "@nanostores/router"
import { map, MapStore } from "nanostores"
import { dehydrateStores, getStoreRegistry, Store } from "../store"

export type ClientRouter = Router & {
  stores: Store[]
}

export const routerStore = map<ClientRouter>()

export const createRouter = (dehydratedRouter: DehydratedRouter): MapStore<ClientRouter> => {
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
    const isNewRoute = routeChange && routeChange?.path !== router.path

    if (isNewRoute && !import.meta.env.SSR) {
      update()
      getRoute(routeChange.path, router.stores)
    }
  })


  if (!import.meta.env.SSR) {
    // We handle a clicks for valid routes as a SPA route
    window.addEventListener('astro:hydrate', () => {
      document.addEventListener('click', (e) => {
        const el = e.target as HTMLAnchorElement

        if (el.tagName === 'A' &&  el.href) {
          const shouldCSR = Object.keys(routes).find(key => {
            return el.href.includes(key)
          })


          if (shouldCSR) {
            e.preventDefault()

            push(el.href)
          }
        }
      })
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
    get stores() {
      return Object.values(getStoreRegistry().get())
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

const getRoute = async (href: string, stores: Store[]) => {
  const page = await fetch(href, {
    headers: {
      '__astro-data': stores ? JSON.stringify(dehydrateStores(stores)) : '{}'
    }
  })
  const body = await page.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(body, 'text/html')
  const oldSpa = document.getElementById('__astro')
  const newSpa = doc.getElementById('__astro')

  // TODO:
  // - properly fetch and patch JS
  // - properly fetch and patch server HTML (not part of the spa?)
  // - properly hydrate the necessary store for the page components
  
  // Patch the DOM head with the new page
  document.head.replaceWith(doc.head)

  if (oldSpa && newSpa) {
    oldSpa.replaceWith(document.importNode(newSpa, true))
  }
}
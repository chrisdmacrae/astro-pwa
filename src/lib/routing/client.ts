import type { RouteConfig, Router } from "./types"
import { createRouter as createNanoRouter, Router as NanoRouter, Pattern } from "@nanostores/router"
import { map, MapStore } from "nanostores"

export type ClientRouter = Router & {
  rawRouter: NanoRouter
}

export const routerStore = map<ClientRouter>()

export const createRouter = (dehydratedRouter: RouteConfig): MapStore<ClientRouter> => {
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
        path: updatedData!.path,
        route: updatedData!.route,
        routes: router.routes.map(route => route[0]),
        push,
        redirect,
        rawRouter: router
      })
    }
  }

  router.subscribe((routeChange) => {
    const isNewRoute = routeChange && routeChange?.path !== routerStore.get()?.path

    if (isNewRoute && !import.meta.env.SSR) {
      update()
      getRoute(routeChange.path)
    }
  })


  if (!import.meta.env.SSR) {
    // We handle a clicks for valid routes as a SPA route
    document.addEventListener('click', (e) => {
      const el = e.target as HTMLAnchorElement

      if (el.tagName === 'A' &&  el.href) {
        e.preventDefault()

        push(el.href)
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
    push,
    redirect,
    rawRouter: router
  })
  
  return routerStore
}

export const getRouterData = (document: Document = window.document) => {
  const dataEl = document.getElementById('__astro-data')

  if (!dataEl) return

  return JSON.parse(dataEl.textContent || '{}') as RouteConfig
}

const getRoute = async (href: string) => {
  const page = await fetch(href)
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
    oldSpa?.replaceWith(newSpa)
  }
}
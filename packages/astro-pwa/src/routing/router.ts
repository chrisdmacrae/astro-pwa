import type { Params } from "astro"
import { map } from "nanostores"
import { createRouter as createNanoRouter, Pattern } from "@nanostores/router"
import { isSSR } from "../ssr/isSsr"

export const routerStore = map<Router>()

export const useRouter = () => routerStore.get() as Router

export type RouteChange = {
  path: string
  route: string
  params: any
}

export type Router = {
  path: string
  route: string
  params: Params
  routes: Route[]
  on: (event: 'change' | 'changed', cb: (change: RouteChange | undefined) => void) => () => void
  go: (path: string) => void
  forward: () => void
  back: () => void
  redirect: (href: string) => void
  dehydrate: () => DehydratedRouter
}

export type Route<P = Pattern<any>> = {
  name: string
  pattern: string | P
  match: (url: string) => boolean
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

  const go = (path: string) => router.open(path)
  const forward = () => {
    if ('navigation' in window) return (window.navigation as any).forward()
    else return window.history.forward()
  }
  const back = () => {
    if ('navigation' in window) return (window.navigation as any).back()
    else return window.history.forward()
  }
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
  const on: Router['on'] = (event, cb) => {
    switch (event) {
      case "change":
        return router.subscribe(cb)
      case "changed":
        return router.listen(cb)
      default:
        return () => null
    }
  }
  const dehydrate = () => {
    const router = routerStore.get()
    const dehydratedRouter: DehydratedRouter = {
      path: router.path,
      params: router.params,
      routes: router.routes
    }

    return dehydratedRouter
  }

  router.subscribe((routeChange) => {
    const router = routerStore.get()
    const isNewRoute = router.path && routeChange && routeChange?.path !== router.path

    if (isNewRoute && !isSSR) {
      update()
    }
  })

  // The router is too stupid to know what to do at init
  if (dehydratedRouter) {
    router.open(dehydratedRouter.path)
  }

  // Initialize first state of router
  const data = router.get()
  const api: Router = {
    path: data?.path || dehydratedRouter.path,
    route: data?.route || '',
    params: data?.params || dehydratedRouter.params,
    routes: dehydratedRouter.routes.map(route => ({
      ...route,
      match: (url: string) => {
        let exp = Array.isArray(route.pattern) ? route.pattern[0]: route.pattern

        if (typeof exp === 'string' && url.toString().includes(exp)) return true
        else if (new RegExp(exp).test(url)) return true

        return false
      }
    })),
    go,
    forward,
    back,
    redirect,
    on,
    dehydrate
  }

  routerStore.set(api)

  return routerStore.get()
}
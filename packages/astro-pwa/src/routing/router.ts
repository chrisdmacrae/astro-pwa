import type { Params } from "astro"
import { map } from "nanostores"
import { createRouter as createNanoRouter, Pattern } from "@nanostores/router"
import { isSSR } from "../ssr/isSsr"
import { getRoute } from "../session/temporary"

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
  on: <T = RouteChange>(event: 'change' | 'changed', cb: (change: RouteChange | undefined) => void) => () => void
  push: (href: string) => void
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
      getRoute(routeChange.path)
    }
  })

  // The router is too stupid to know what to do at init
  router.open(dehydratedRouter?.path)

  // Initialize first state of router
  const data = router.get()
  const api: Router = {
    path: data!.path,
    route: data!.route,
    params: data!.params,
    routes: dehydratedRouter.routes,
    push,
    redirect,
    on: (event, cb) => {
      switch (event) {
        case "change":
          return router.subscribe(cb)
        case "changed":
          return router.listen(cb)
        default:
          return () => null
      }
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
  }

  routerStore.set(api)

  return routerStore.get()
}
import type { Pattern, RouteParams } from "@nanostores/router"
import type { MapStore } from "nanostores"

export type Router = {
  path: string
  route: string
  routes: string[]
  push: (href: string, as: string) => void
  redirect: (href: string) => void
}

export type Route<P = Pattern<RouteParams>> = {
  name: string
  pattern: string | P
}

export type DehydratedRouter = {
  path: slugs
  url: URL
  params: Params
  routes: Route[]
  data: Record<string, any>
}
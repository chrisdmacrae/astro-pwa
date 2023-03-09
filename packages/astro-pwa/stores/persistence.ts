import type { AstroGlobal } from "astro"
import type { DehydratedRouter } from "../routing/types"
import type { DehydratedStores } from "./hydration"

export const getClientStoreData = (request: AstroGlobal['request']) => {
  return JSON.parse(request.headers.get('__astro-data') || '{}') as DehydratedRouter
}

export const sendClientStoreData = async (href: string, output: "server" | "static", data: DehydratedStores, dehydratedRouter: Partial<DehydratedRouter> = {}) => {
  const isServer = output === "server"
  const headers = isServer
    ? {
      '__astro-data': JSON.stringify({
        ...dehydratedRouter,
        data
      })
    } : undefined

  return await fetch(href, { headers: headers })
}

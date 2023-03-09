import type { AstroGlobal } from "astro"
import type { DehydratedRouter } from "../routing/router"
import type { DehydratedStores } from "../stores/hydration"

export type DehydratedData = Partial<DehydratedRouter> & {
  output: "server" | "static"
  data: DehydratedStores
}

export const getDehydratedData = (document: Document = window.document) => {
  const dataEl = document.getElementById('__astro-data')

  if (!dataEl) return {} as DehydratedData

  return JSON.parse(dataEl.textContent || '{}') as DehydratedData
}

export const getClientStoreData = (request: AstroGlobal['request']) => {
  return JSON.parse(request.headers.get('__astro-data') || '{}') as DehydratedData
}

export const sendClientStoreData = async (href: string, dehydratedData: DehydratedData) => {
  const isServer = dehydratedData.output === "server"
  const headers = isServer ? { '__astro-data': JSON.stringify(dehydratedData) } : undefined

  return await fetch(href, { headers: headers })
}

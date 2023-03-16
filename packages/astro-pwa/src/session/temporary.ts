import type { AstroGlobal } from "astro"
import type { DehydratedRouter } from "../routing/router"
import type { DehydratedStores } from "../stores/hydration"

export type DehydratedData = Partial<DehydratedRouter> & {
  output: "server" | "static"
  data: DehydratedStores
}

export const getDehydratedData = (el?: Element | null) => {
  const data = el?.getAttribute('data')

  if (!data) return {} as DehydratedData

  return JSON.parse(data) as DehydratedData
}

export const getAstroData = (request: AstroGlobal['request']) => {
  return JSON.parse(request.headers.get('__astro-data') || '{}') as DehydratedData
}

export const fetchWithClientStoreData = async (href: string, dehydratedData: DehydratedData, init: RequestInit = {}) => {
  const isServer = dehydratedData.output !== "static"
  const headers = isServer ? { '__astro-data': JSON.stringify(dehydratedData) } : undefined

  return await fetch(href, { 
    ...init,
    headers: {
      ...init.headers || {},
      ...headers,  
    }
  })
}

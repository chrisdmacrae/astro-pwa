import type { AstroGlobal } from "astro"
import type { DehydratedRouter } from "../routing/router"
import type { DehydratedStores } from "../stores/hydration"

export type DehydratedData = Partial<DehydratedRouter> & {
  output: "server" | "static"
  data: DehydratedStores
}

export const getDehydratedData = (el?: Element | null) => {
  const dataEl = el?.querySelector(':scope > script[data-astro]') as HTMLScriptElement | null | undefined

  if (!dataEl) return {} as DehydratedData

  return JSON.parse(dataEl.textContent || '{}') as DehydratedData
}

export const getClientStoreData = (request: AstroGlobal['request']) => {
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

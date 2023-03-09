import { useEffect, useMemo } from "react";
import { isSSR } from "./ssr/isSsr";
import { useStore as useNanoStore } from "@nanostores/react"
import { Store, useStore as useAstroStore } from './stores/store'
import { hydrateClientStore } from "./stores/hydration";
import { routerStore } from "./routing/router";

export const useStore = <T extends object = any>(store: Store<T>) => {
  useEffect(() => {
    useAstroStore(store)
  }, [])

  if (!isSSR) {
    useMemo(() => {
      hydrateClientStore(store)
    }, [])
  }

  return useNanoStore(store)
}

export const useRouter = () => useNanoStore(routerStore)

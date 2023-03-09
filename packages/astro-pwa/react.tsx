import { useEffect, useMemo } from "react";
import { isSSR } from "./ssr/isSsr";
import { useStore as useNanoStore } from "@nanostores/react"
import { Store, useStore as useAstroStore } from './stores/store'
import { hydrateStore } from "./stores/hydration";
import { routerStore } from "./routing/client";

export const useStore = <T extends object = any>(store: Store<T>) => {
  useEffect(() => {
    useAstroStore(store)
  }, [])

  if (!isSSR) {
    useMemo(() => {
      hydrateStore(store)
    }, [])
  }

  return useNanoStore(store)
}

export const useRouter = () => useNanoStore(routerStore)

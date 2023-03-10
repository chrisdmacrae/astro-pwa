import { useEffect, useMemo } from "react";
import { useStore as useNanoStore } from "@nanostores/react"
import { Store, useStore as useAstroStore } from './src/stores/store'
import { routerStore } from "./src/routing/router";

export const useStore = <T extends object = any>(store: Store<T>) => {
  useEffect(() => {
    useAstroStore(store)
  }, [])

  return useNanoStore(store)
}

export const useRouter = () => useNanoStore(routerStore)

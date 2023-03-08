import { useLayoutEffect, useMemo } from "react";
import { isSSR } from "./ssr/isSsr";
import { useStore as useNanoStore } from "@nanostores/react"
import { Store, useStore as useAstroStore } from './stores/store'
import { hydrateStore } from "./stores/hydration";
import { routerStore } from "./routing/client";

export const useStore = <T extends object = any>(store: Store<T>) => {
  const router = useRouter()

  if (!isSSR && router.config.output === "server") {
    useMemo(() => {
      hydrateStore(store)
    }, [])
  }

  return [useNanoStore(store), useAstroStore(store)] as const
}

export const useRouter = () => useNanoStore(routerStore)

import { useStore as useNanoStore } from "@nanostores/react"
import { useMemo } from "react";
import { routerStore } from "./routing/client";
import type { Store } from "./store"
import { hydrateStore } from "./store";

export const useStore = (store: Store) => {
  if (!import.meta.env.SSR) {
    useMemo(() => hydrateStore(store), [])
  }

  return useNanoStore(store)
}

export const useRouter = () => useNanoStore(routerStore)
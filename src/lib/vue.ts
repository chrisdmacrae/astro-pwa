import { useStore as useNanoStore } from "@nanostores/vue"
import { routerStore } from "./routing/client"
import { hydrateStore, Store } from "./store"

export const useStore = (store: Store) => {
  if (!import.meta.env.SSR) {
    hydrateStore(store)
  }

  return useNanoStore(store)
}

export const useRouter = () => useNanoStore(routerStore)
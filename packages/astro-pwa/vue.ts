import { useStore as useNanoStore } from "@nanostores/vue"
import { Store, useStore as useAstroStore } from './stores/store'
import { isSSR } from "./ssr/isSsr"
import { hydrateStore } from "./stores/hydration"
import { routerStore } from "./routing/client"

export const useStore = <T extends object = any>(store: Store<T>) => {
  useAstroStore(store)

  if (!isSSR) {
    hydrateStore(store)
  }

  return useNanoStore(store)
}

export const useRouter = () => useNanoStore(routerStore).value

import { useStore as useNanoStore } from "@nanostores/vue"
import { Store, useStore as useAstroStore } from './stores/store'
import { isSSR } from "./ssr/isSsr"
import { hydrateStore } from "./stores/hydration"
import { routerStore } from "./routing/client"

export const useStore = <T extends object = any>(store: Store<T>) => {
  const router = useRouter()

  if (!isSSR && router.config.output === "server") {
    hydrateStore(store)
  }

  return [useNanoStore(store), useAstroStore(store)] as const
}

export const useRouter = () => useNanoStore(routerStore).value

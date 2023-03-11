import { useStore as useNanoStore } from "@nanostores/vue"
import { Store, useStore as useAstroStore } from './src/stores/store'
import { routerStore } from "./src/routing/router"

export const useStore = <T extends object = any>(store: Store<T>) => {
  useAstroStore(store)

  return useNanoStore(store)
}

export const useRouter = () => useNanoStore(routerStore).value

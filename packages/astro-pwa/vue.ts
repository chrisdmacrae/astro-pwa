import { watchEffect } from "vue"
import { useStore as useNanoStore } from "@nanostores/vue"
import { Store, useStore as useAstroStore } from './src/stores/store'
import { routerStore } from "./src/routing/router"

export const useStore = <T extends object = any>(store: Store<T>, frameId?: string) => {
  watchEffect(() => useAstroStore(store, frameId))

  return useNanoStore(store)
}

export const useRouter = () => useNanoStore(routerStore).value

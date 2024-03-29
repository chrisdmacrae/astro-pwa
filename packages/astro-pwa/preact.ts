import { useEffect } from 'preact/hooks'
import { useStore as useNanoStore } from "@nanostores/preact"
import { Store, StoreValues, useStore as useAstroStore } from './src/stores/store'
import { routerStore } from './src/routing/router'

export const useStore = <T extends StoreValues = any>(store: Store<T>, frameId?: string) => {
  useEffect(() => {
    useAstroStore(store, frameId)
  }, [store, frameId])

  return useNanoStore(store) as T
}

export const useRouter = () => useNanoStore(routerStore)
import { map, MapStore } from 'nanostores'
import type { DehydratedRouter } from '../routing/types'
import { registerStore } from './clientStoreRegistry'
import type { DehydratedStores } from './hydration'

export type Store<T extends object = any> = MapStore<T> & {
  name: string
  defaultValue: T
}

export const useStore = <T extends object = any>(store: Store<T>) => {
  registerStore(store)

  return store
}

export const createStore = <T extends object = any>(name: string, value: T):Store<T> => {
  const mapStore = map<T>(value)
  const store = {
    ...mapStore,
    defaultValue: value,
    name
  }

  return store
}

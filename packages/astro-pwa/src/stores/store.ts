import type { MapStore, Store as NanoStore, WritableAtom } from 'nanostores'
import { registerStore } from './storeRegistry'

type AstroStoreData<T = any> = {
  name: string
  defaultValue: T
}

export type StoreValues = string | number | Array<any> | object

export type Store<T = StoreValues> = (T extends object ? MapStore<T> : WritableAtom<T>) & AstroStoreData<T>

export const createStore = <T extends StoreValues = any>(name: string, store: T extends object ? MapStore<T> : NanoStore<T>) => {
  return { ...store, name, defaultValue: store.get() } as Store<T>
}

export const useStore = <T extends StoreValues>(store: Store<T>, frameId?: string) => {
  registerStore(store, frameId)

  return store
}

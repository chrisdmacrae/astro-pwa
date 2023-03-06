import { map, MapStore } from 'nanostores'
import type { AllKeys } from 'nanostores/atom'
import { getDehydratedRouter } from '../routing/client'

declare global {
  var storeRegistry: MapStore<Record<string, Store>>
}

const createStoreRegistry = <T extends object = any>() => map<Record<string, Store<T>>>({})

export const getStoreRegistry = () => {
  if (import.meta.env.SSR) {
    return global.storeRegistry = global.storeRegistry || createStoreRegistry()
  }
  else {
    return window.storeRegistry = window.storeRegistry || createStoreRegistry()
  }
}

export type Store<T extends object = any> = MapStore<T> & {
  name: string
}

export const createStore = <T extends Record<string, any> = any>(name: string, value: T): Store<T> => {
  const mapStore = map<T>(value)
  const store = {
    ...mapStore,
    name
  }
  const registry = getStoreRegistry().get()

  if (registry[name]) {
    return registry[name] as Store<T>
  }
  else {
    storeRegistry.set({ ...registry, [name]: store })
  }

  return store
}

export const hydrateStore = <T extends object = any>(store: Store<T>) => {
  const serverData = getDehydratedStoreData(store.name)
  const clientData = store.get()

  if (serverData && serverData !== clientData) {
    Object.keys(serverData).forEach(key => {
      store.setKey(key as AllKeys<T>, serverData[key])
    })
  }

  return store
}

export const dehydrateStores = (stores: Store[]) => stores.reduce((map, store) => {
  map[store.name] = store.get()

  return map
}, {} as Record<string, Store>)

export const getDehydratedStoreData = (name: string, document: Document = window.document) => {
  const routerData = getDehydratedRouter(document)

  return routerData?.['data']?.[name]
}
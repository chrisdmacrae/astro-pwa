import { map, MapStore } from 'nanostores'
import { getRouterData } from '../routing/client'

export type Store = MapStore & {
  name: string
}

export const createStore = <T extends Record<string, any>>(name: string, value: T): Store => {
  const store = map(value)

  return {
    ...store,
    name
  }
}

export const hydrateStore = (store: Store) => {
  const data = getStoreData(store.name)

  if (data) {
    Object.keys(data).forEach(key => {
      store.setKey(key, data[key])
    })
  }

  return store
}

export const getStoreData = (name: string, document: Document = window.document) => {
  const routerData = getRouterData(document)

  return routerData?.['data']?.[name]
}
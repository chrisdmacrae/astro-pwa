import type { AllKeys } from 'nanostores/atom'
import { getClientStoreData, getDehydratedData } from '../session/temporary'
import type { Store } from './store'

export type DehydratedStore = Pick<Store, 'name' | 'defaultValue'> & { [key: string]: any }
export type DehydratedStores = Record<string, DehydratedStore>

export const hydrateServerStore = (store: Store<any>, request: Request) => {
  // Ensure the stores are "immutable" per request
  store.set(store.defaultValue)
  
  const {data} = getClientStoreData(request)
  const currentData = store.get()
  const routerData = data[store.name]
  const hydrationData = { ...currentData, ...routerData }

   store.set(hydrationData)
}

export const hydrateClientStore = <T extends object = any>(store: Store<T>) => {
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
}, {} as DehydratedStores)

export const getDehydratedStoreData = (name: string, document: Document = window.document) => {
  const dehydratedData = getDehydratedData(document)

  return dehydratedData?.['data']?.[name]
}

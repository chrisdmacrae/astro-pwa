import type { AllKeys } from 'nanostores/atom'
import type { StoreValues } from 'nanostores/computed'
import { getClientStoreData, getDehydratedData } from '../session/temporary'
import type { Store } from './store'

export type DehydratedStore<T extends object = any>  = Pick<Store, 'name' | 'defaultValue'> & T
export type DehydratedStores = Record<string, DehydratedStore>

export const hydrateServerStore = (store: Store<any>, request: Request) => {
  // Ensure the stores are "immutable" per request
  store.set(store.defaultValue)

  const {data} = getClientStoreData(request)  
  if (data) {
    const currentData = store.get()
    const routerData = data[store.name]
    const hydrationData = { ...currentData, ...routerData }
    
    store.set(hydrationData)
  }
}

export const hydrateClientStore = <T = StoreValues<any>>(el: Element, store: Store<T>) => {
  const serverData = getDehydratedStoreData(el, store.name)
  const clientData = store.get()

  if (serverData && serverData !== clientData) {
    if ('setKey' in store) {
      Object.keys(serverData).forEach(key => {
        store.setKey(key as AllKeys<T>, serverData[key])
      })
    }
    else {
      store.set(serverData)
    }
  }

  return store
}

export const dehydrateStores = (stores: Store[]) => stores.reduce((dehydratedStores, store) => {
  dehydratedStores[store.name] = store.get()

  return dehydratedStores
}, {} as DehydratedStores)

export const getDehydratedStoreData = (el: Element, name: string) => {
  const dehydratedData = getDehydratedData(el)

  return dehydratedData?.['data']?.[name]
}

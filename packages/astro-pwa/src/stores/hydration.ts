import type { AllKeys } from 'nanostores/atom'
import { getClientStoreData, getDehydratedData } from '../session/temporary'
import type { State, Store } from './store'

export type DehydratedStore = Pick<Store, 'name' | 'defaultValue'> & { [key: string]: any }
export type DehydratedStores = Record<string, DehydratedStore>

export const hydrateServerStore = (store: Store<any> | State<any>, request: Request) => {
  // Ensure the stores are "immutable" per request
  store.set(store.defaultValue)

  const {data} = getClientStoreData(request)

  console.log({ data })
  
  if (data) {
    const currentData = store.get()
    const routerData = data[store.name]
    const hydrationData = { ...currentData, ...routerData }
    
    store.set(hydrationData)
  }
}

export const hydrateClientStore = <T extends object = any>(el: Element, store: Store<T> | State<T>) => {
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

export const dehydrateStores = (stores: (Store | State)[]) => stores.reduce((dehydratedStores, store) => {
  dehydratedStores[store.name] = store.get()

  return dehydratedStores
}, {} as DehydratedStores)

export const getDehydratedStoreData = (el: Element, name: string) => {
  const dehydratedData = getDehydratedData(el)

  return dehydratedData?.['data']?.[name]
}

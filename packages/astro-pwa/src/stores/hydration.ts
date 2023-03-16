import type { AstroGlobal } from 'astro'
import type { AllKeys } from 'nanostores/atom'
import type { StoreValues } from 'nanostores/computed'
import { getAstroData, getDehydratedData } from '../session/temporary'
import type { Store } from './store'
import { getStoreRegistry } from './storeRegistry'

export type DehydratedStore<T extends object = any>  = Pick<Store, 'name' | 'defaultValue'> & T
export type DehydratedStores = Record<string, DehydratedStore>

export const getAllStoreData = () => {
  const registry = getStoreRegistry()

  if (!registry) return {}
  
  return Object.keys(registry).reduce((storesByFrame, frameId) => {
    storesByFrame[frameId] = dehydrateStores(registry[frameId])

    return storesByFrame
  }, {} as Record<string, DehydratedStores>)
}

// TODO: this will break if you have multiple stores with the same name across frames
export const dehydrateStores = (stores: Store[]) => stores.reduce((dehydratedStores, store) => {
  dehydratedStores[store.name] = store.get()

  return dehydratedStores
}, {} as DehydratedStores)

export const hydrateServerStore = (frameId: string, store: Store<any>, request: Request) => {
  // Ensure the stores are "immutable" per request
  store.set(store.defaultValue)

  const {data} = getAstroData(request)
  if (data) {
    const currentData = store.get()
    const routerData = data?.[frameId]?.[store.name] || {}
    console.log(data, routerData)
    const hydrationData = { ...currentData, ...routerData }
    
    store.set(hydrationData)
  }
}

export const getServerFrameStoreData = (frameId: string, request: AstroGlobal['request']) => {
  const {data} = getAstroData(request)
  const frameStores = data?.[frameId]

  if (frameStores) return Object.keys(frameStores)

  return []
}

export const hydrateClientStore = <T = StoreValues<any>>(el: Element, store: Store<T>) => {
  const serverData = getClientFrameStoreData(el, store.name)
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

export const getClientSPAStoreData = (frameId: string, name: string) => {
  const spa = document?.getElementById('__astro')

  if (!spa) return {}

  const dehydratedData = getDehydratedData(spa)

  return dehydratedData?.data?.[frameId]?.[name]
}

export const getClientFrameStoreData = (el: Element, name: string) => {
  const dehydratedData = getDehydratedData(el)

  return dehydratedData?.data?.[el.id]?.[name]
}

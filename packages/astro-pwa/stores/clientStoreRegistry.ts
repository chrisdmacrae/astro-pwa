import { map, MapStore } from "nanostores";
import type { Store } from "./store";

export type ClientRegistry = MapStore<Store[]>

let clientRegistry: ClientRegistry | undefined
export const createClientStoreRegistry = () => {
  clientRegistry = map([]) as ClientRegistry
}

export const getClientStoreRegistry = () => {
  return clientRegistry?.get()
}

export const getClientStoreRegistryStore = () => {
  return clientRegistry
}

export const registerStore = (store: Store<any>) => {
  if (clientRegistry) {
    const currentStores = clientRegistry.get()
    const existingStore = currentStores.find(s => s.get().name === store.get().name)

    if (existingStore) {
      return existingStore
    }
    
    clientRegistry.set([...currentStores, store])
  }
}
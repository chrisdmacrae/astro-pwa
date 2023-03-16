import { map, MapStore } from "nanostores";
import type { Store } from "./store";

export type StoreRegistry = MapStore<Store[]>
export type FrameStoreRegistry = MapStore<Record<string, Store[]>>
export type AnnouncedStores = MapStore<Store[]>

const ORPHAN_FRAME_KEY = "__astro"

let frameRegistry: FrameStoreRegistry | undefined
export const createStoreRegistry = (id: string) => {
  if (!frameRegistry) {
    frameRegistry = map({}) as FrameStoreRegistry
  }

  frameRegistry.setKey(id, [])
}

export const getStoreRegistry = () => {
  return frameRegistry?.get() || {}
}

export const getStoreRegistryStore = () => {
  return frameRegistry
}

export const getStoresFromRegistry = (frameId: string) => {
  const registry = getStoreRegistry()

  if (registry !== undefined && registry[frameId]) {
    return registry[frameId]
  }

  return []
}

export const registerStore = (store: Store<any>, frameId: string = ORPHAN_FRAME_KEY) => {
  if (frameRegistry && frameId) {
    const frameRegistrations = frameRegistry.get()
    const currentStoresForFrame = frameRegistrations[frameId!] || []
    const existingStore = currentStoresForFrame.find(s => s.name === store.name)

    if (!existingStore && import.meta.env.DEV) {
      console.warn(`Store ${store.name} was registered to frame ${frameId} more than once.`)
    }

    console.log(`Registering store ${store.name} for frame ${frameId}`)
    frameRegistry.setKey(frameId!, [...currentStoresForFrame, store])

    return store
  }
}
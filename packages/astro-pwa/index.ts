import { routerStore } from './routing/client'

export { pwaIntegration } from './integration/pwa'
export type { PwaIntegrationOptions as SpaIntegrationOptions } from './integration/pwa'

export { createPageRoutesFromGlob } from './routing/server'
export const router = routerStore

export { createStore, useStore } from './stores/store'
export { getDehydratedStoreData as getStoreData } from './stores/hydration'
export type { Store } from './stores/store'


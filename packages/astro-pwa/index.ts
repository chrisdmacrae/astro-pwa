import { routerStore } from './routing/client'

export { spaIntegration } from './integration/pwa'
export type { SpaIntegrationOptions } from './integration/pwa'

export { createPageRoutesFromGlob } from './routing/server'
export const router = routerStore

export { createStore } from './stores/store'
export { getDehydratedStoreData as getStoreData } from './stores/hydration'
export type { Store } from './stores/store'


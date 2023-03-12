import { map } from "nanostores"
import { createStore } from "astro-pwa/src/stores/store"

export const appStore = createStore('app', map({ on: false }))
export const testStore = createStore('test', map({ on: false }))

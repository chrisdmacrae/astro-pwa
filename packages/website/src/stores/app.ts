import { map } from "nanostores"
import { createStore } from "astro-pwa/src/stores/store"

export const appStore = createStore('app', map({ on: false }))

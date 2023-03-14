import { createStore } from 'astro-pwa'
import { map } from 'nanostores'

export const appStore = createStore('app', map({ theme: 'system' }))
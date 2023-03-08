import { createStore } from "astro-pwa"

export const counterStore = createStore('counter', { count: 0 })
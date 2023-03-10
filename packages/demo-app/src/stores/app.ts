import { createStore } from "astro-pwa";

export const appStore = createStore('app', { on: false })
export const testStore = createStore('test', { on: false })

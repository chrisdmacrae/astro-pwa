import { createStore } from "astro-pwa"

export const globalStore = createStore<Record<string, any>>('global', { foo: "bar" })
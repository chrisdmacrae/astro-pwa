import { createStore } from "astro-pwa"
import { map } from "nanostores"

export const globalStore = createStore<Record<string, any>>('global', map({ foo: "bar" }))
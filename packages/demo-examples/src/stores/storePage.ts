import { createStore } from "astro-pwa";

const DEFAULT_STATE = { renderedBy: "server" }

export const storePageStore = createStore<Record<string, any>>('storePage', DEFAULT_STATE)
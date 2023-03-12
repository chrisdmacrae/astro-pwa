import { createStore } from "astro-pwa";
import { map } from "nanostores";

export const storePageStore = createStore<Record<string, any>>('storePage', map({ renderedBy: "server" }))
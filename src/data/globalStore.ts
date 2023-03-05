import { createStore } from "../lib/store";

export const globalStore = createStore<Record<string, any>>('global', { foo: "bar" })
import { createStore } from "../lib";

export const globalStore = createStore<Record<string, any>>('global', { foo: "bar" })
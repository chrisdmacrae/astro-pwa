import { createStore } from "../../lib/store";

export const counterStore = createStore('counter', { count: 0 })
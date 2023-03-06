import { createStore } from "../../lib";

export const counterStore = createStore('counter', { count: 0 })
import { createStore } from "astro-pwa"

export const counterStore = createStore('counter', { count: 0 })

export const subtract = () => counterStore.setKey('count', counterStore.get().count - 1)

export const add = () => counterStore.setKey('count', counterStore.get().count + 1)

import { createStore } from "astro-pwa"
import { map } from 'nanostores'

export const counterStore = createStore('counter', map({ count: 0 }))

export const subtract = () => counterStore.setKey('count', counterStore.get().count - 1)

export const add = () => counterStore.setKey('count', counterStore.get().count + 1)

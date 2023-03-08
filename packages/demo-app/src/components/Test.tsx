
import { createStore } from 'astro-pwa'
import { useStore } from 'astro-pwa/react'

const testStore = createStore('test', {})

export const Test = () => {
  const data = useStore(testStore)

  return null
}
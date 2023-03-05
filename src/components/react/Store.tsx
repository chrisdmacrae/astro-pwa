import { useEffect } from 'react'
import { createStore } from '../../lib/store'
import { useStore } from '../../lib/react'

export const storePageStore = createStore<Record<string, any>>('page', { state: "server" })

export const StorePage = () => {
  const data = useStore(storePageStore)
  const onClick = () => {
    alert(`State is: ${data.state}`)
  }

  useEffect(() => {
    storePageStore.setKey('state', 'client')
  }, [])

  return (
    <>
      <p>Server store example</p>
      <p>{JSON.stringify({data})}</p>
      <button onClick={onClick}>Click me to get current state</button>
    </>
  )
}
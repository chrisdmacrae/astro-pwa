import { useEffect } from 'react'
import { useStore } from 'astro-pwa/react'
import { storePageStore } from '../../stores/storePage'

export const StorePage = () => {
  const [data, store] = useStore(storePageStore)
  const showState = () => {
    alert(`State is: ${JSON.stringify(data)}}`)
  }
  const addState = () => {
    store.setKey('added', 'some new state')
  }
  const removeState = () => {
    store.setKey('added', null)
  }

  useEffect(() => {
    store.setKey('renderedBy', 'client')

    return () => {
      store.set(store.defaultValue)
    }
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <p>Server store example</p>
      <pre className="p-4 bg-slate-500 border border-slate-600 text-slate-50 rounded-xl">
        {JSON.stringify({data})}
      </pre>
      <button onClick={showState} className="p-2 px-4 bg-sky-500 hover:bg-sky-600 border-sky-600 rounded-lg text-white">
        Click me to get current state
      </button>
      <button onClick={addState} className="p-2 px-4 bg-sky-500 hover:bg-sky-600 border-sky-600 rounded-lg text-white">
        Click me to add to state
      </button>
      <button onClick={removeState} className="p-2 px-4 bg-sky-500 hover:bg-sky-600 border-sky-600 rounded-lg text-white">
        Click me to remove to state
      </button>
    </div>
  )
}
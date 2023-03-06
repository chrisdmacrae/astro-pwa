import { useEffect } from 'react'
import { createStore } from '../../lib'
import { useStore } from '../../lib/react'

const DEFAULT_STATE = { renderedBy: "server" }

export const storePageStore = createStore<Record<string, any>>('storePage', DEFAULT_STATE)

export const StorePage = () => {
  const data = useStore(storePageStore)
  const showState = () => {
    alert(`State is: ${JSON.stringify(data)}}`)
  }
  const addState = () => {
    storePageStore.setKey('added', 'some new state')
  }
  const removeState = () => {
    storePageStore.setKey('added', null)
  }

  useEffect(() => {
    storePageStore.setKey('renderedBy', 'client')

    return () => {
      storePageStore.set(DEFAULT_STATE)
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
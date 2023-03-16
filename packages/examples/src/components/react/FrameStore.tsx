import { useEffect, useRef } from 'react'
import { useStore } from 'astro-pwa/react'
import { createStore } from 'astro-pwa'
import { map } from 'nanostores'

export const frameStore = createStore('implicit', map<Record<string, any>>({ foo: "bar", renderedBy: "client" }))

export const FrameStorePage = () => {
  const ref = useRef<HTMLElement | null>()
  const data = useStore(frameStore, 'frame_store_frame')

  const showState = () => {
    alert(`State is: ${JSON.stringify(data)}}`)
  }
  const addState = () => {
    frameStore.setKey('added', 'some new state')
  }
  const removeState = () => {
    frameStore.setKey('added', null)
  }

  useEffect(() => {
    frameStore.setKey('renderedBy', 'client')

    return () => {
      frameStore.set(frameStore.defaultValue)
    }
  }, [])

  return (
    <div className="flex flex-col gap-2" ref={r => ref.current = r}>
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

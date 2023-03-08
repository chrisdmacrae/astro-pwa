import type { PropsWithChildren } from 'react'
import { useStore } from 'astro-pwa/react'
import { counterStore } from '../../stores/counter'

export function ReactCounter({ children }: PropsWithChildren) {
  const [{count}, store] = useStore(counterStore)
	const add = () => store.setKey('count', count + 1)
	const subtract = () => store.setKey('count', count - 1)

	return (
		<>
      <div className="flex flex-col gap-2">
        <h2 className="text-md slate-500">A counter in React, sharing global state with all other frameworks</h2>
        <div className="flex flex-row justify-center gap-2 p-4 bg-slate-100 border border-slate-200 rounded-xl">
          <button onClick={subtract} className="p-2 px-4 bg-red-200 hover:bg-red-300 border border-red-300 hover:border-red-400 text-red-500 rounded-lg">
            -
          </button>
          <pre className="p-2 border border-slate-300 bg-slate-200 rounded-lg">
            {count}
          </pre>
          <button onClick={add} className="p-2 px-4 bg-green-200 hover:bg-green-300 border border-green-300 hover:border-green-400 text-green-500 rounded-lg">
            +
          </button>
        </div>
			</div>
			<div className="counter-message">{children}</div>
		</>
	);
}

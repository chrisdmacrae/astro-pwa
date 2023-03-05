import type { PropsWithChildren } from 'react';
import { useStore } from '../../lib/react';
import { counterStore } from './counter';

export function ReactCounter({ children }: PropsWithChildren) {
  const {count} = useStore(counterStore)
	const add = () => counterStore.setKey('count', count + 1)
	const subtract = () => counterStore.setKey('count', count + -1)

	return (
		<>
			<div className="counter">
        <h2>A counter in React, sharing global state with all other frameworks</h2>
				<button onClick={subtract}>-</button>
				<pre>{count}</pre>
				<button onClick={add}>+</button>
			</div>
			<div className="counter-message">{children}</div>
		</>
	);
}

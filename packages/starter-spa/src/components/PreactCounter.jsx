import './PreactCounter.css'
import { useStore } from 'astro-pwa/preact'
import { counterStore, add, subtract } from '../stores/counter'

export function PreactCounter() {
  const {count} = useStore(counterStore)

  return (
		<>
      <div className="counter">
        <h2>A counter in Preact, sharing global state</h2>
        <div className="controls">
          <button onClick={subtract}>
            -
          </button>
          <pre>
            {count}
          </pre>
          <button onClick={add}>
            +
          </button>
        </div>
			</div>
		</>
	);
}

export default PreactCounter

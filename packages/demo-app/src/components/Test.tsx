import { useStore } from "astro-pwa/react"
import { appStore } from "../stores/app"

export const Test = () => {
  const [appState] = useStore(appStore)

  return (
    <div>
      <p>{appState.on ? 'true' : 'false'}</p>
      <button onClick={() => appStore.setKey('on', !appState.on)}>dfghdfsghj</button>
    </div>
  )
}

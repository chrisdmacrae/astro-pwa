import { useStore } from "astro-pwa/react"
import { appStore } from "../stores/app"

export const Test = () => {
  const state = useStore(appStore)

  return (
    <>
      <button onClick={() => appStore.setKey('on', !state.on)}>{state.on ? 'Off' : 'On'}</button>
    </>
  )
}

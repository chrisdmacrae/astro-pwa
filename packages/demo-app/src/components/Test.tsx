import { useStore } from "astro-pwa/react"
import { useEffect, useState } from "react"
import { appStore } from "../stores/app"

export const Test = () => {
  const {on} = useStore(appStore)

  useState(() => { appStore.setKey('on', true) }, [])

  return (
    <div>
      <p>{on ? 'true' : 'false'}</p>
      <button onClick={() => appStore.setKey('on', !on)}>dfghdfsghj</button>
    </div>
  )
}

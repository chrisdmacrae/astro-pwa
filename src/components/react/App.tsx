import type { PropsWithChildren } from "react"
import { createStore } from "../../lib/store"
import { useStore } from "../../lib/react"

export const appStore = createStore<Record<string, any>>('app', { foo: "bar" })

export type AppProps = PropsWithChildren

export const App = ({ children }: AppProps) => {
  const storeData = useStore(appStore)

  return (
    <>
      <p>Hello from React App: {JSON.stringify(storeData)}</p>
      {children}
    </>
  )
}

export default App
import type { PropsWithChildren } from "react"
import { useStore } from "../../lib/react"
import { globalStore } from "../../data/globalStore"

export type AppProps = PropsWithChildren

export const App = ({ children }: AppProps) => {
  const storeData = useStore(globalStore)

  return (
    <>
      <p>Hello from React App: {JSON.stringify(storeData)}</p>
      {children}
    </>
  )
}

export default App
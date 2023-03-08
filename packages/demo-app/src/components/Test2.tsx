import { useEffect, useState } from "react"

export const Test2 = () => {
  const [x, setX] = useState('x')

  useEffect(() => setX('z'))

  return <div>{x}</div>
}

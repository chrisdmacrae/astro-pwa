import { useRouter } from "../../../lib/react"
import { PageA } from "./PageA"
import { PageB } from "./PageB"

export const Router: React.FC = () => {
  const router = useRouter()

  console.log({ router })
  
  return (
    <>
      {router.path.endsWith('a') && <PageA />}
      {router.path.endsWith('b') && <PageB />}
    </>
  )
}
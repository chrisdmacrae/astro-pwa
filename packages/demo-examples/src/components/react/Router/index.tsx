import { useRouter } from "astro-pwa/react"
import { PageA } from "./PageA"
import { PageB } from "./PageB"

export const Router: React.FC = () => {
  const router = useRouter()
  
  return (
    <>
      {router.route.endsWith('a') && <PageA />}
      {router.route.endsWith('b') && <PageB />}
    </>
  )
}
import { useEffect } from "react"
import { useRouter } from "../../lib/react"

export const Nav = () => {
  const router = useRouter()

  useEffect(() => {
    console.log('mounting')
    
    return () => {
      console.log('unmounting')
    }
  }, [])

  return (
    <nav>
      This page is: {router.route}
    </nav>
  )
}
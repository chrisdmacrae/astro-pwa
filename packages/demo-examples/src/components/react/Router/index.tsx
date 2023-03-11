import { useRouter } from "astro-pwa/react"
import { PageA } from "./PageA"
import { PageB } from "./PageB"
import { Dynamic } from "./Dynamic"
import { Home } from "./Home"

export type RouterProps = {
  routes: string[]
  baseUrl: string
}

export const Router: React.FC<RouterProps> = ({ routes, baseUrl }) => {
  const router = useRouter()

  switch (router.route) {
    case `${baseUrl}/router/a`:
      return <PageA routes={routes} baseUrl={baseUrl} />
    case `${baseUrl}/router/b`:
      return <PageB routes={routes} baseUrl={baseUrl} />
    case `${baseUrl}/router/[slug]`:
      return <Dynamic routes={routes} baseUrl={baseUrl} />
  }

  return <Home routes={routes} baseUrl={baseUrl} />
}
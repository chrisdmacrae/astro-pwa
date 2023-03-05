## Building a SPA

- State management
  - You want all islands to share state
      - A single component that responds to the route and is SSRd;
      - A single component that responds to the static route and data and is SSRd, or;
      - A set of components that responds to the static route, are SSRd, and load data;
- Routing
  - SSR
    - Astro has no idea what pages are what -- this needs to be delegated to the SPA
      - Basically
  - Link clicks to known route URLs need to be intercepted and handled via app state instead
  - Non-known links are actual page refreshes
  - Routes are prefetched
  - Type-safety
    - We know about _static_ routes via pages
    - We don't know about dynamic routes; these instead render server-side
      - Because of this, you can't get type-safety on these URLs without providing them ahead of time
    - 
- Hydration
  - Routing
    - The app needs to know what the current route should be, even on the server, to be able to render the right content
  - The app needs to be able to hydrate from data
    - This is simple with Astro: build pages that render your app, and pass the data to the app
- 

# Static route

You render a static page for the SPA to load on. This is a simple route, 

```astro name="index.astro"
---
const router = createRouter(Astro)
const routeConfig = router.dehydrate()
---
<html>
  <head>
    <title></title>
  </head>
  <body>
    <SPA routeConfig={routeConfig}>
      <App />
    </SPA>
  </body>
</html>
```

```tsx name="TestPage.tsx"
import { useRouter } from 'astrospa/react'

export const TestPage = () => {
  const router = useRouter()
}
```

# Dynamic static route

You render a series of static pages for the SPA to load on.

```astro name="[slug].astro"
---
export async function getStaticPaths() {
  const pages = await async()

  return pages.map(page => ({
    params: { slug: page.slug },
    props: { page }
  }))
}

const { page } = Astro.page
const router = createRouter(Astro)
---
<html>
  <head>
    <title></title>
  </head>
  <body>
    <SPA router={router}>
      <App>
        <Page data={page.data} />
      </App>
    </SPA>
  </body>
</html>
```

```tsx name="TestPage.tsx"
import { useRouter } from 'astrospa/react'

export const TestPage = () => {
  const router = useRouter()

  switch (router.route) {
    case "/app/:h
  }
}
```

## Notes

### Astro model

Astro pages do SSR. They generate HTML. The data from that SSR needs to be embedded into the page and pullable by the SPA.

Nano stores provide an agnostic API for pulling that data.

If logic fetched the page, read the JSON, it could push that to the SPA to render instead of asking for a full page refresh.

## Isomorphic SPA

Routing is based on the filesystem. Any in-framework abstraction would be _terrible_, full-stop. This is because you'd need
to build and maintain a framework/library specific abstraction that makes sense for the domain of that app.

Instead, this thing needs to be smart enough to:

- Get the data for the next page on a route change
- Get the JS for the next page on preload
- Get the CSS for the next page on preload
- Update the URL accordingly
- Handle "patching" blocks of HTML that aren't client-side
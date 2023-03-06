# Building a SPA

What we're trying to achieve...

Astro lets you build an MPA with islands of interactive client-side components that are hydrated.

A SPA works the same way, but it generally renders an entire "tree" of framework components as a 
single unit, scoping data accordingly.

What this aims to achieve is creating global state for:

- Routing
  - When navigatin on links, do client-side routes for known "SPA" pages
- App state
  - On client-side hydrate, hydrate global state for all islands

The end result should allow:

- Multiple islands to communicate with eachother
- Client-side routing between MPA generated routes
  - Persisting global state between navigation between routes
- Having a few conceptual models:
  - A traditional SPA...
    - Generated from a single astro template, optionally with SEO-friendliness using getStaticPaths and a catch-all dynamic route
  - An MPA app that hydrates into a SPA
  - Islands in the sky...
    - Multiple astro islands sharing context, and 

# Usage

The integration works as follows...

## 1. Wrap your "SPA" in the SPA component

We'll create a server-side router to extract the current page info from Astro, and then setup a wrapper for our SPA.

```astro name="src/pages/app/index.astro"
---
import { createRouter } from '../../lib/server'
import SPA from '../../lib/spa'

const router = createRouter(Astro, {
  routes: () => ({ name: 'home', pattern: '/app'})
})
---
<SPA router={route}>
  <h1>hello world</h1>
</SPA>
```

Then create a component to act as your SPA. For now, we'll use React:

```tsx name="src/components/App.tsx"
import { useRouter } from ''

export const App = () => {
  const router = useRouter()

  switch (route.route) {
    case "/app":
      return <h1>Hello world</h1>
    default:
      return null
  }
}

export default App
```

Add it to your page and have it hydrate on `client:load`:

```
import { createRouter } from '../../lib/server'
import SPA from '../../lib/spa'
import App from '../../components/App.tsx'

const router = createRouter(Astro, {
  routes: () => ({ name: 'home', pattern: '/app'})
})
---
<SPA router={route}>
  <h1>hello world</h1>
  <App client:load />
</SPA>
```

Now add some state to your SPA by creating a store alongside your app:

```tsx name="src/components/App.tsx"
import { useRouter, useStore } from '../lib/react'
import { createStore } from '../lib/spa'

export const appStore = createStore('app', { foo: 'bar' })

export const App = () => {
  const router = useRouter()
  const appData = useStore(appStore)

  switch (route.route) {
    case "/app":
      return (
        <>
          <h1>Hello world</h1>
        </>
      )
    default:
      return null
  }
}

export default App
```

Now, we'll add a second route to our app and render the global state in it, too:

```tsx name="src/components/SecondPage.tsx"
import { useRouter, useStore } from '../lib/react'
import { createStore } from '../lib/spa'
import { appStore } from './App'

export const SecondPage = () => {
  const appData = useStore(appStore)
  const addKey = () => {
    appStore.setKey('secondPage': 'wuz here')
  }

  return (
    <div>
      <h2>I'm a second page!</h2>
      <p>From global app state: {JSON.stringify(appData)}</p>
      <button onClick={addKey}>Update app state</button>
    </div>
  )
}

export default App
```

Add the route to your app:

```

```

# Examples

## Static route

You render a static page for the SPA to load on. This is a simple route, 

```astro name="src/pages/app/index.astro"
---
import Page from '../../components/TestPage.tsx'
import { createRouter } from '../../lib/server'

const router = createRouter(Astro, {
  routes: () => ({ name: 'home', pattern: '/app' })
})
---
<html>
  <head>
    <title></title>
  </head>
  <body>
    <SPA router={router}>
      <App client:load />
    </SPA>
  </body>
</html>
```

```tsx name="src/components/TestPage.tsx"
import { useRouter } from ''

export const TestPage = () => {
  const router = useRouter()

  switch (route.route) {
    case "/app":
      return <h1>Hello world</h1>
    default:
      return null
  }
}

export default TestPage
```

## Dynamic static route

You render a series of static pages for the SPA to load on.

```astro name="src/pages/app/[...slug].astro"
---
import Page from '../../components/TestPage.tsx'
import { createRouter } from '../../lib/server'

export async function getStaticPaths() {
  const pages = await asyncFunction()

  return pages.map(page => ({
    params: { slug: page.slug },
    props: { page, pages }
  }))
}

const { page, pages } = Astro.page 
const router = createRouter(Astro, {
  routes: () => pages.map(page => ({
    name: page.slug,
    pattern: `/app/${page.slug}`
  }))
})
---
<html>
  <head>
    <title></title>
  </head>
  <body>
    <SPA router={router}>
      <App>
        <Page data={page.data} client:load />
      </App>
    </SPA>
  </body>
</html>
```

```tsx name="TestPage.tsx"
import { useRouter } from '../lib/react'

export const TestPage = () => {
  const router = useRouter()

  switch(router.route) {
    case "/app":
      return <h1>Hello world</h1>
    case "/app/page-1":
      return <h1>Hello from page 1</h1>
    default:
      return null
  }
}

export default TestPage
```

## Server

WIP: this API is not ready yet

You render an server-rendered page for the SPA to boot from.

```astro name="src/pages/app/index.astro"
---
import Page from '../../components/TestPage.tsx'
import { createRouter } from '../../lib/server'

const pages = await asyncFunc()
const router = createRouter(Astro, {
  pages: () => pages.map(page => ({
    name: page.slug,
    pattern: page.slug
  }))
})
---
<html>
  <head>
    <title></title>
  </head>
  <body>
    <SPA router={router}>
      <App client:load />
    </SPA>
  </body>
</html>
```

```tsx name="src/components/TestPage.tsx"
import { useRouter } from '../lib/react'

export const TestPage = () => {
  const router = useRouter()

  switch (route.route) {
    case "/app":
      return <h1>Hello world</h1>
    case "/app/page-1":
      return <h1>Hello from page 1</h1>
    default:
      return null
  }
}

export default TestPage
```

# Notes

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
- Hydration
  - Routing
    - The app needs to know what the current route should be, even on the server, to be able to render the right content
  - The app needs to be able to hydrate from data
    - This is simple with Astro: build pages that render your app, and pass the data to the app

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

## Server routing

LEAVE IT TO ASTRO

## Modes

### Server

Server mode assumes that the HTML template body of different pages is _different_.

In other words, `/app/a` renders different HTML and a different set of islands than `/app/b`.

### Lifecycle

1. Server / pre-render
  1. Server state is initialized from the store
  2. Then the server has the opportunity to mutate state
  3. Then the state is serialized to JSON and stored in DOM
2. Client hydrate
  1. The island is hydrated
  2. It renders
  3. It attempts to hydrate from the DOM state    
3. Client navigation
  1. The route being requested is well-known;
    1. Yes
      1. Request the page HTML, sending client-state via headers
      2. Patch the head
      3. Patch the SPA
      4. Re-render or hydrate the elements from the DOM
    2. No
      3. Do a full-page refresh

### Client

Client mode assumes that the HTML template body of different pages is _the same_.

In other words, `/app/a` renders the same HTML and the same set of islands as `/app/b`.

### Lifecycle

1. Server / pre-render
  1. Server state is initialized from the store
  2. Then the server has the opportunity to mutate state
  3. Then the state is serialized to JSON and stored in DOM
2. Client hydrate
  1. The island is hydrated
  2. It renders
  3. It attempts to hydrate from the DOM state
3. Client navigation
  1. The route being requested is well-known;
    1. Yes
        1. Request the page as JSON, sending client-state via headers
        2. Patch the DOM state
        3. Re-render the router, triggering a DOM update
    2. No
      3. Do a full-page refresh

# Hybrid

Hybrid mode assumes that the HTML template body of different pages will have consistency, but change.

This requires more configuration than server or client mode, but offers the most freedom.

You instruct `astro-pwa` on what content is server-rendered and what server-rendered content to patch into the DOM on a route change
with an `astro-island` attribute. Any server content without this attribute will be ignored.

Example:

```
---
import App from '../components/App'
import Microfrontend from '../components/Microfrontend'
import SPA from '../lib/SPA.astro'

const isHome = Astro.url.pathname = "/app"
const data = await data
const router = createDehydratedRouter(Astro, { routes: Astro.glob('../app/**/*.astro') })
---
<SPA mode="hybrid" router={router}>
  <nav class="classes" data-astro-island="nav">
    <ul><li class={isHome ? 'active' : 'inactive'}>Home</li></ul>
  </nav>
  <App client:load />
  <Microfrontend client:hybrid>
    <section data-astro-island="microfrontend">
      <p>I am a server-rendered island</p>
    </section>
  </Microfrontend>
</SPA
```
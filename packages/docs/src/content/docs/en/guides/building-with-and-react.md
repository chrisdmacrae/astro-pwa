---
title: "Building a SPA with React"
description: "A guide into using the SPA component to build single page applications with React"
---
To learn more about SPAs (Single Page Applications), read about [SPAs vs MPAs](/docs/en/concepts/spa).

## The SPA Component

Turning a set of astro pages is _easy_. It takes 10 lines of code or less. We couldn't make this up.

Create a layout for you SPA at `src/layouts/AppLayout.astro`:

```
---
import { createPageRoutesFromGlob } from 'astro-pwa'
import SPA from 'astro-pwa/SPA.astro'

const routes = await createPageRoutesFromGlob(Astro.glob('../pages/**/*.astro'))
---
<html>
<head>
    <title>My New SPA</title>
</head>
<body>
    <SPA routes={routes}>
        <slot />
    </SPA>
</body>
```

Now wrap your pages at `src/pages/app` with the layout:

```
---
import AppLayout from '../../layouts/AppLayout.astro
---
<AppLayout>
    <h1>Hello world</h2>
    <p>I'm alive</p>
    <p><a href="/app/page-2">Go to page 2</a>
</AppLayout>
```

Now all `a` tags pointing to pages in the `app` folder wrapped with `AppLayout` with render without a page refresh!

## Global state in the SPA

The SPA supports global state available to all routes in the SPA. This is achieved by creating [Stores](/docs/en/concepts/stores) and passing them to the `SPA` component.

For example, say we had two stores, `src/stores/app.js` and `src/stores/theme.js`. We can make them available by creating a `src/stores/index.js`:

```
import { appStore } from './app'
import { themeStore } from './theme'

export const globalStores = [appStore, themeStore]
```

And then passing them to the `SPA` component in `src/layouts/AppLayout.astro`:


```
---
import { createPageRoutesFromGlob } from 'astro-pwa'
import SPA from 'astro-pwa/SPA.astro'
import { globalStores } from '../src/stores'

const routes = await createPageRoutesFromGlob(Astro.glob('../pages/**/*.astro'))
---
<html>
<head>
    <title>My New SPA</title>
</head>
<body>
    <SPA routes={routes} stores={globalStores}>
        <slot />
    </SPA>
</body>
```

Now these stores will be guaranteed to be available to all of your routes, _and_ will synchronize with the server.

### Using React

To add React to your Astro site, use the Astro CLI and follow the on-screen prompts:

```
npx astro add react
```

Once complete, you can now create a React component in your site. We'll create a toggleable element that will remember whether it's
open for the duration of the users session.

To start, create your toggle component at `src/components/Toggle.tsx`:

```
export const Toggle = ({ children }) => {
    return (
        <details>
            <summary>Click me to open me</details>
            <div>
                {children}
            </div>
        </details>
    )
}
```

Next, we'll add an `open` prop to allow toggling the element open and closed programatically:

```
export const Toggle = ({ open, children }) => {
    return (
        <details open={open} aria-expanded={open}>
            <summary>Click me to open me</details>
            <div>
                {children}
            </div>
        </details>
    )
}
```

Now that our toggle is ready to be open and closed, we'll create a [Store](/docs/en/concepts/stores) to manage the state on the server and the client
at `src/stores/toggle.js`:

```
import { createStore, Store } from 'astro-pwa'
import { map } from 'nanostores'

export const createToggleStore = (id: string, openByDefault?: boolean) => (['toggle', id].join('-'), map({ open: openByDefault }))

export const toggle = (store: Store) => store.get().setKey('toggle', !store.get().toggle)
```

> We export a function called `createToggleStore` to allow us to create a unique store for every toggle. Otherwise every instance of the toggle component
> would share the same state. No bueno!

Let's use the toggle store in our component to generate data for every instance of our toggle component:

```
import { useId } from 'react'
import { useStore } from 'astro-pwa/react'
import { createToggleStore } from '../stores/toggle'

export const Toggle = ({ open, children }) => {
    const id = useId()
    const {open: isOpen} = useStore(createToggleStore(id, open))

    return (
        <details open={isOpen} aria-expanded={isOpen}>
            <summary>Click me to open me</details>
            <div>
                {children}
            </div>
        </details>
    )
}
```
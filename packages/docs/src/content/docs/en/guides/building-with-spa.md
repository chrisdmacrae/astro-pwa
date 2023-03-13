---
title: "Building wth SPA"
description: "A guide into using the SPA component to build single page applications"
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

### Using stores

Read the guide on [sharing UI state with the server](/docs/en/guides/sharing-state) to learn more
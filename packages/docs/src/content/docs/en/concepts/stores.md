---
title: "Stores"
description: "Share state between server and client securely and safely with stores"
---
Forms are a framework agnostic approach to sharing state across Astro components and [Astro Islands](https://docs.astro.build/docs/en/concepts/islands/) **on the client and the server**.

## Why Stores?

Sharing state across the server and the client is key for a web application. But the nature of Astro can make that tough for newcomers. Stores intend to do all of the
heavy lifting for you, allowing you to focus on building your applications.

On top of this, [Astro Islands](https://docs.astro.build/docs/en/concepts/islands/) render in isolation, which means the in-framework methods of sharing state between components
usually don't work very well. Stores eliminate this problem, making it simple to share state between Astro components and multiple islands, even when using different frameworks.

## How do they work?

Stores rely on the officially recommended tool for sharing state, [Nanostores](https://github.com/nanostores/nanostores). Nanostores are a framework agnostic way of sharing
state between components.

Stores expand on nanostores by making them _well-known_ and _server-ready_ by using [Frames](/docs/en/concepts/frames). Stores make it easy to re-use nanostores across components and the server-browser boundary.

To synchronize with the server, stores use a concept called _request chaining_. Every request to the server in an unbroken chain will persist the client-side state, and any changes made on the server, back with the client. This means that everytime the a page is refreshed, the state is reset.

## How do I use stores?

You can use stores in-browser only by creating a store and consuming it in your component.

## In an Astro component

First create a store at `src/stores/`, such as `src/stores/app.js`:

```
import { createStore } from 'astro-pwa'
import { map } from 'nanostores'

export const appStore = createStore('app', map({ theme: 'system' }))
```

Then consume the store in your Astro component or page on the server:

```
---
import { useStore } from 'astro-pwa'
import { appStore } from '../src/stores/app'

const { theme } = useStore(appStore)
---
<html>
<head>
    <title>My Example App</title>
</head>
<body class={theme}>
    <h1>Hello world</h1>
    <p>I am alive!</p>
</body>
</html>
---
```

Or on the client using a `script` tag:

```
<html>
<head>
    <title>My Example App</title>
</head>
<body class={theme}>
    <h1>Hello world</h1>
    <p>I am alive!</p>

    <script>
        import { useStore } from 'astro-pwa'
        import { appStore } from '../src/stores/app'

        const { theme } = useStore(appStore)

        document.addEventListener('DOMContentLoaded', () => document.body.classList.add(theme))
    </script>
</body>
</html>
```

And you can _share_ state between the client and server by using a [Frame](/docs/en/concepts/frame):

```
---
import { useStore } from 'astro-pwa'
import Frame from 'astro-pwa/Frame.astro'
import { appStore } from '../src/stores/app'

const { theme } = useStore(appStore)

appStore.setKey('theme', 'dark')
---
<html>
<head>
    <title>My Example App</title>
</head>
<body class={theme}>
    <Frame id="theme">
        <h1>Hello world</h1>
        <p>I am alive!</p>

        <script>
            import { useStore } from 'astro-pwa'
            import { appStore } from '../src/stores/app'

            const { theme } = useStore(appStore)

            document.addEventListener('DOMContentLoaded', () => document.body.classList.add(theme))
        </script>
        </Frame>
</body>
</html>
```

## In a framework component

This guide is coming soon, we promise! 💝
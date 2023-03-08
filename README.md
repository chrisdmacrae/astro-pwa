# Astro PWA

The following is an _alpha_ project, aiming to allow you to build progessive web application _inside_ of an Astro site.

## _Inside_, what do you mean?

This integration does not aim to turn an Astro _project_ into a progressive web app. You can do that if you want, however
this aims to allow you to turn parts of your Astro project into a progressive web app.

This will allow you to use one Astro site to:

- Deliver a marketing website
- Deliver a documentation site
- Deliver one or more progressive web apps

It does this by letting you scope a directory and it's sub-directories of pages as a PWA, while leaving the rest
of your pages as basic web pages.

## Usage

Install the integration:

```
npm install astro-pwa
```

Add it to your Astro config:

```
import { defineConfig } from 'astro/config';
import { pwaIntegration } from 'astro-pwa';

// https://astro.build/config
export default defineConfig({
  integrations: [pwaIntegration()],
})
```

Then create a layout for your PWA at `src/layouts/AppLayout.astro`:

```
---
import SPA from 'astro-pwa/SPA.astro'
import { createPageRoutesFromGlob } from 'astro-pwa'

const routes = await createPageRoutesFromGlob(Astro.glob('../pages/app/**/*.astro'))
---
<html>
<head>
  <title>My new app</title>
</head>
<body>
  <SPA routes={routes}>
</body>
</SPA>
```

Next, create a home for your app `src/pages/app/index.astro`, importing `AppLayout` from `'src/layouts/AppLayout.astro`:

```
---
import AppLayout from '../layouts/AppLayout.astro'
---
<AppLayout>
  <h1>Hello world</h1>
  <p>I'm alive!</p>
</AppLayout>
```

At this point, you have everything "plumbed" to work, but nothing really interesting...

At this point you can do a variety of things, follow the tutorial that makes the most sense to you:

- Coming soon...

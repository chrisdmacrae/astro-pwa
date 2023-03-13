---
title: "Installation"
description: "Installing Astro PWA, from A-Z"
---
This guide will walk you through the steps to manually install and configure a new Astro project with Astro PWA.

## Prequisites

- **Node.js**: `v16.12.0` or higher.
- **Text editor**: we recommend [VS Code](https://code.visualstudio.com/) with the [Official Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
- **Terminal**: Astro is accessed through its command-line interface (CLI).

## Installation

If you already have an existing project, skip to [Install the Integration](#install-the-integration).

### Create your Astro project

Run the Astro CLI and follow the on-screen prompts:

```
npm create astro
```

### Install the Integration

Install the integration using your terminal:

```
npm install astro-pwa nanostores
```

## Configure `astro.config.mjs`:

In your text editor, open `astro.config.mjs` and update it with the following content:

```
import { defineConfig } from 'astro/config';
import { pwaIntegration } from 'astro-pwa';

// https://astro.build/config
export default defineConfig({
    plugins: [pwaIntegration()]
});
```

### Optional: enable server mode

We recommend running Astro in server mode to get the most out of Astro PWA. You _can_ build statically rendered [SPAs](/docs/en/concepts/spa) but we really recommend building a server rendered application to be able to build a truly dynamic app. Read [Server vs Client](/docs/en/concepts/server-vs-client) to better understand why.

To do so, update your Astro config by running:

```
npx astro add node
```

> Don't worry about setting up a "node" server for now, we'll talk about deployment later!

## That's it!

That's all you need to do to _install_ Astro PWA. Now you need to decide what's next:

- Read about [SPAs vs MPAs](/docs/en/concepts/spa) and how Astro PWA helps you build SPAs
- Learn about [Astro Frames](/docs/en/concepts/frames) and how they help you build dynamic applications with very little JS
- Try your hand at using [Astro Forms](/docs/en/concepts/forms) to create type-safe, secure forms on the server
- [Create your first Store](/docs/en/concepts/stores) and start sharing state between the server and client
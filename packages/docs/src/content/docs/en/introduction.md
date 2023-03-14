---
title: "Getting Started"
description: "A short introduction to Astro PWA"
---

## What is Astro PWA?

Astro PWA is a _tiny_ integration for Astro that helps you build modern progressive web apps inside of an Astro site.

## _Inside_, what do you mean?

This integration does not aim to turn an entire Astro project or site into a progressive web app. You can do definitely do that if you want, however this aims to give you more control, allowing you to turn sections of your Astro site into a progressive web app.

This will allow you to use one Astro site to:

- Deliver a marketing website
- Deliver a documentation site
- Deliver one or more progressive web apps

It does this by letting you scope a directory and it's sub-directories of pages as a PWA, while leaving the rest of your pages as basic web pages.

## Core Concepts

- Server frames: a new web architecture for building zero-JS interactive sites
- Server-first API design: move expensive client-side JS off your site until it's necessary
- Tiny as heck: Astro PWA ships 15kb of JS when all of its features are used. _LESS_ if you don't use them all!
- SPA-ready: any section of your site can be turned into an interactive SPA with 3 lines of code.
- UI-agnostic: just like Astro, we support React, Preact, Svelte, Vue, Solid, Lit and more

## Start your first project
<!--
Get a new Astro project up and running locally with our Astro template:
```
npm create astro -- --template astro-pwa/starter-server
```
-->

Our [Installation guide](/docs/en/installation) has full, step-by-step instructions for installing the Astro PWA integration by creating a new project from an existing Astro PWA GitHub repository, and for installing Astro PWA manually.

## Learn more  🚀

See examples of the key use cases of Astro PWA

- [Add a single page application (SPA)](/docs/en/guides/building-with-spa) to your Astro site
- Make [interactive islands of server-side code](/docs/en/guides/building-with-frames) with Frames
- Build [type-safe, server validated Forms](/docs/en/guides/building-with-forms)
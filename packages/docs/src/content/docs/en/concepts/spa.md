---
title: "SPA vs MPA"
description: "Build interactive SPA or MPA applications using Astro PWA"
---
## Terminology

A Multi-Page Application (MPA) is a website consisting of multiple HTML pages, mostly rendered on a server. When you navigate to a new page, your browser requests a new page of HTML from the server. Astro is an MPA framework. Traditional MPA frameworks also include Ruby on Rails, Python Django, PHP Laravel, WordPress, Joomla, Drupal and static site builders like Eleventy or Hugo.

A Single-Page Application (SPA) is a website consisting of a single JavaScript application that loads in the user’s browser and then renders HTML locally. SPAs may also generate HTML on the server, but SPAs are unique in their ability to run your website as a JavaScript application in the browser to render a new page of HTML when you navigate. Next.js, Nuxt, SvelteKit, Remix, Gatsby, and Create React App are all examples of SPA frameworks.

> **Source**: thanks to the Astro team for this perfect dilineation

## Using MPA architecture

The MPA is great for raw performance when you can fetch all of the data you need to a page quickly. It's also great for handling secure content like billing information
that should be transmitted in as few places as possible.

You should use the MPA architecture when:

- You want faster raw performance
- You can load the data you need on the server fast enough
- You're dealing with sensitive information (like billing information).

You can build MPAs with interactive content using [Frames](/docs/en/concepts/frames), which allow you to build interactive experiences using only the server. Frames protect your
user against XSS (Cross site scripting) and XSRF (Cross Site Forgery Requests) with zero-configuration.

## Using SPA architecture

The [SPA component](/docs/en/guides/building-with-spa) is great for perceived performance for end-users. It makes pages load without a page refresh, making your application feel snappy.

You should use the SPA architecture when:

- You want faster perceived performance
- You can't load the data you need on the server fast enough; you offload this loading to the browser

You also get access to client-side [routing](/docs/en/guides/routing) when you use the [SPA component](/docs/en/guides/building-with-spa)

## Using both architectures

Nothing is stopping you from mixing and matching in a single application, that's the beauty of Astro PWA!

You can have a [SPA](/docs/en/guides/building-with-spa) that uses client-side logic for a bunch of beautiful animations, view transitions, et cetera, while using [Frames](/docs/en/concepts/frames) to embed secure, server-rendered content into your page.
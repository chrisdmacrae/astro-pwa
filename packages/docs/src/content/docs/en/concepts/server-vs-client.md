---
title: "Astro Forms"
description: "Build type-safe, server-validated forms using Astro Forms"
---
Forms are a server-first approach to building rich, interactive experiences with user input with Astro.

## Why server-first?

You shouldn't ever trust a browser with your data. Whether you concerned about security, or concerned about immutability of your data, you can't trust that
malicious code isn't running in your users browser, either maliciously or accidentally.

When third-party malicious code runs in the browser, you can't trust that any JS executing is securely interacting with your application. Server-first let's us
automatically enable checks-and-balances between the browser and your Astro site's server to guarantee the requests to the server are coming from your user. If they're not,
we'll kick the malicious request to the curb and ask your user to log back in!

## What is an Astro Form?

An astro form is a two part ensemble:

- The server-side form: server-side logic that handles validating the data submitted to the server, and submitting the form to a third-party service, like a database or SaaS application
- The client-side form: a basic HTML form rendered with the `Form` component, or a form submitted via AJAX using client-side JS or an [Astro Island](https://docs.astro.build/docs/en/concepts/islands/)

Together, the Astro Form integration makes building secure, interactive, and type-safe forms fun, easy, and simple.

## How do I use forms?

There are two ways to create a form. The first is using the `Form` Astro PWA component to generate a server-rendered form that submits via a standard `POST` request. The other
is building your own Javascript form using Vanilla JS or a framework component rendered by an [Astro Island](https://docs.astro.build/docs/en/concepts/islands/).

- [Read the guide](/docs/en/guides/building-with-forms) on using the Form component
- A guide on building with framework components is coming soon
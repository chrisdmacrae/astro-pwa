---
title: "Building with Frames"
description: "A guide to using Frames to build server-rendered applications"
---
To learn more about the concept of Astro Frames, read about [Frames](/docs/en/concepts/frames).

## The Frame Component

The `Frame` component allows you to build interactive elements with very little Javascript. 2kb to be exact!

It can be used one of three scenarios:

- To share data with the server using [Stores](/docs/en/concepts/forms) and [SPA](/docs/en/guides/building-with-spa)
- To dynamically render content from one page in another page
- To act as a "page in a page", with it's own routing and navigation

In all scenarios it expects you to have your [site output as a `server`](https://docs.astro.build/en/guides/server-side-rendering/). 
It isn't super useful in a static site.

## Sharing data with the server

To share data with the server, you first need to [wrap your app with the `SPA` component](/en/docs/guides/building-with-spa).

For this example, we'll create a simple store for a checkbox. You can use stores and Frames to build shared server state for just about everything.

First, create your store in `src/stores/toggle.js':

```
import { createStore } from 'astro-pwa'
import { map } from 'nanostores'

export const toggleStore = createStore('toggle', { on: false })

export const toggle = () => toggleStore.setKey('on', !toggleStore.get().on)
```

Then create a toggle component at `src/components/Toggle.astro`. We'll setup the toggle to render the state of the store on the server:

```
---
import { useStore } from 'astro-pwa'
import { toggleStore } from '../src/stores/toggle'

const { on } = useStore(toggleStore)
---
<input type="checkbox" name="toggle" value={on} />
```

Now we'll add some basic Javascript using a `<script>` tag to synchronize the toggle store with the checkbox on the client:

```
---
import { useStore } from 'astro-pwa'
import { toggleStore } from '../src/stores/toggle'

const { on } = useStore(toggleStore)
---
<input type="checkbox" name="toggle" id="toggle" value={on} />

<script>
    import { toggleStore, toggle } from '../src/stores/toggle'

    document.addEventListener("DOMContentLoaded", () => {
        const toggle = document.getElementById('toggle')

        if (!toggle) return

        toggle.addEventListener('click', () => toggle())
    })
</script>
```

Now as you interact with the toggle, it's state will be remembered as you navigate around, until you refresh the page.

## Dynamically render content from another page

You can use frames to load in the content from one page into another page. This is super useful for re-using server-rendered [Forms](/docs/en/concepts/forms).

For example, say you had a billing page with a billing address form and a payment method form, and you wanted to show one of the forms also inside a Modal. Instead
of re-building that logic or abstracting it to be re-usable, you can render it in a frame and have the form work as-if it was on its own page!

For this guide, we'll use a simpler example to make it easy to understand. We'll just display some fake JSON data for a user, render it on a page representing a user
profile, and use frames to make the profile available anywhere in the app!

Let's create a page at `src/pages/profile.astro` with a user profile and wrap it in a frame:

```
---
import Frame from 'astro-pwa/Frame.astro'

const user = {
    first_name: "John",
    last_name: "Appleseed",
    email: "john.appleseed@example.com"
}
---
<html>
<head>
    <title>{user.first_name}'s profile</title>
</head>
<body>
  <Frame id="user_profile">
    <div>
      <h2>{[user.first_name, user.last_name].join(' ')}</h2>
      <p>{user.email}</p>
    </div>
  </Frame>
</body>
</html>
```

Next, in `src/pages/index.astro` we'll render the frame into the page like so:

```
<html>
<head>
    <title>Home</title>
</head>
<body>
  <h1>Welcome to the app</h1>
  <Frame id="user_profile" src="/profile" />
</body>
</html>
```

> The key here is embedding a Frame into the page with the same `id` as the Frame from the other page we want to render, and then setting the `src` attribute to the URL of the page. The frame will do the rest!

Lastly, we don't want the Frame to be empty while it's getting the profile, so we'll add a loading state as the default content of the frame:

```
<html>
<head>
    <title>Home</title>
</head>
<body>
  <h1>Welcome to the app</h1>
  <Frame id="user_profile" src="/profile">
    <p>Loading...</p>
  </Frame>
</body>
</html>
```

## A "Page In A Page"

To use a Frame to render an interactive section of server-rendered content in a page, we use the `server:` directives to tell the frame how to operate.

By default, `server:isolate` tells a Frame to capture all navigation events with `a` tags and `form` submits, and then looks for a corresponding frame with the same `id`
in the new page that would be found to update the frame.

If no frame content is found, the frame will tell the page to navigate to the new page instead.

### An Example

Say you wanted to render a CTA to check out pricing plans on your page, but you didn't want the user to navigate away when clicking the CTA.

Instead, you can use two `Frame`s to have the content load in-place, replacing the CTA.

To do so, we'll create a page at `src/pages/index.astro` with the CTA and a `Frame` named `pricing` with the `server:isolate` directive:

```
<html>
<head>
    <title>Home</title>
</head>
<body>
  <h1>Welcome to the app</h1>
  <Frame id="pricing" server:isolate />
</body>
</html>
```

Then inside the `Frame` we'll add our CTA linking to `/plans`:

```
<html>
<head>
    <title>Home</title>
</head>
<body>
  <h1>Welcome to the app</h1>
  <Frame id="pricing" server:isolate>
    <h2>We've got cheap pricing!</h2>
    <a href="/plans">Check out our plans</a>
  </Frame>
</body>
</html>
```

Now we'll create the `/plans` page at `src/pages/plans.astro`:

```
<html>
<head>
    <title>Home</title>
</head>
<body>
  <h1>Our pricing</h1>
  <Frame id="pricing">
    <h2>All of our plans</h2>
    <ul>
      <li>Basic plan: $1</li>
      <li>Less basic plan: $2</li>
      <li>Pretty much not basic plan: $3</li>
    </ul>
  </Frame>
</body>
</html>
```

And that's it! The frame will render the contents of the `Frame` with the `id` of `pricing` when clicking the link!

### With Forms

To use `Frames` with forms, check out [using forms](/docs/en/guides/building-with-forms).

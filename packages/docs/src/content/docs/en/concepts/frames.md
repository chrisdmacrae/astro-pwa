---
title: "Astro Frames"
description: "Build interactive server-rendered islands using Astro Frames"
---

Frames are a pattern of web architecture that allow you to embed interactive islands of server-rendered into your page. They allow you to update the content of a page without refreshing the page with less than 2kb of client-side JS.

## What is an Astro Frame?

The term "Astro Frame" refers to a section of a page that is made known to the server as a "changing" section of content. Multiple Frames can exist on a page.

Think of them as "moving pictures" into the a static picture rendered by the server as your web page.

They're similar but opposite to [Astro Islands](https://docs.astro.build/en/concepts/islands/) which make a section of your static page interactive on the client. Frames make your page interactive on the server.

<div class="bg-slate-200 border border-slate-400 p-2 grid grid-cols-3 grid-rows-5 gap-2">
    <div class="col-span-3 h-20 bg-green-200 border-2 border-green-400 text-green-700 p-2 flex justify-center items-center">
        Header (interactive server-rendered frame)
    </div>
    <div class="col-span-1 row-span-4 h-90 bg-green-200 border-2 border-green-400 text-green-700 p-2 flex flex-col text-center justify-center items-center">
        Sidebar <span class="block">(interactive server-rendered frame)</span>
    </div>
    <div class="col-span-2 row-span-3 bg-green-50 border-2 border-lime-500 text-lime-700 p-2 flex justify-center items-center">
        Content (static HTML content)
    </div>
    <div class="col-span-2 h-90 bg-pink-200 border-2 border-pink-500 text-pink-700 p-2 flex justify-center items-center">
        Interactive content (Astro Island)
    </div>
    <div class="col-span-3 bg-green-50 border-2 border-lime-500 text-lime-700 p-2 flex justify-center items-center">
        Header (interactive server-rendered frame)
    </div>
</div>

In Astro PWA, you can use Astro components or any supported UI framework to build a frame. A frame can even render an [Astro island](https://docs.astro.build/en/concepts/islands/).

The technique used is DOM diffing, which intelligently compares the frames on the page with new frames coming from the server, updating only the HTML that has changed.

## How Do Frames Work in Astro?

When in server-mode, Astro generates the content of a page in front of every request to your site. By default, you need to refresh the page to generate new content, which can lead
to a really jarring experience in an interactive application.

```
---
const user = Astro.cookie.get('session').json()
---
<section>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
</section>
```

With Frames, you embed identifiers for content that should re-render without a page refresh directly into the page, so when the server goes to render it again, it knows which content it can pull into the existing page and update.

```
---
import Frame from 'astro-pwa/Frame.astro'

const user = Astro.cookie.get('session').json()
---
<Frame id="user-info">
    <section>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
    </section>
</Frame>
```

This keeps every application fast by default by **shipping less than 2kb of client-side JS** to make an interactive experience.

## What are the benefits of Frames?

The biggest benefit of Frames is performance. You don't need to ship extra Javascript to make an interactive application. All of your website is converted into static HTML, either
at build-time or at request time, and once it's downloaded by the browser it's ready to go. JavaScript is one of the slowest assets that you can load per-byte, so every byte counts.

Another benefit is security: if you don't make secret values like access tokens or personal information accessible by Javascript, it's much harder to steal. Frames delegate all
of your important business logic to the server where you can keep secret and private information, well, secret and private.

Even better, you can control how Astro frames work, whether they prevent a full-page refresh on a link click or form submit, or re-render themselves by passing a [server directive](/en/reference/server-directive). Server directives tell Astro frames how to behave according to user input.

In Astro PWA, it’s up to you as the developer to explicitly tell Astro which components on the page need exist in a Frame. Otherwise Astro will simply render the page to static
HTML and move on with its day.

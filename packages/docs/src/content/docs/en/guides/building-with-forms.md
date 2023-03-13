---
title: "Using Forms"
description: "A guide to using the Form integration to build dynamic forms"
---
To learn more about the concept of Astro Frames, read about [Forms](/docs/en/concepts/forms).

## Building your first form

Forms are a two-part affair:

- A `Form` component for creating forms in the browser, collecting user input, and showing validation errors
- A server-side handler for receiving form submissions, validating them, and submitting them

## Creating your client-side form

To start, we'll create a form for the user to start, since all good tools start with the user.

Create a component for your form at `src/components/ExampleForm.astro`:

```
---
import { AstroForm } from 'astro-pwa'

export interface Props {
  form: AstroForm
}

const { form } = Astro.props
---
<form id="example">
</form>
```

> All forms require a unique `id` to work. Make sure you set one!

Right now all we've got is an empty form with an `id`. Let's add an input for `first_name`, `last_name`, and `email`:

```
---
import { AstroForm } from 'astro-pwa'

export interface Props {
  form: AstroForm
}

const { form } = Astro.props
---
<form id="example">
  <label for="first_name">First name</label>
  <input type="text" name="first_name" id="first_name" />

  <label for="last_name">Last name</label>
  <input type="text" name="last_name" id="last_name" />

  <label for="email">Email</label>
  <input type="email" name="email" id="email" />
</form>
```

Now, let's add validation to our form. We do this by defining a schema for the fields of our form using Zod, or `z` for short:

```
---
import { AstroForm, z} from 'astro-pwa'

const fields = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email()  
})

export interface Props {
  form: AstroForm<typeof fields>
}

const { form } = Astro.props
---
```

Now that we have our fields, we have type-safety and autosuggestion on the `form` prop. This allows us to add validation errors to our form.

There are three kinds of validation errors:

- A general message, great for showing at the top of the form
- Form level errors, such as errors submitting the form
- Field level errors, such as missing a required field, min/max length, etc

Let's add some validation rules to our fields. We'll make `first_name` and `last_name` both required to be a minimum of 2 characters:

```
import { AstroForm, z} from 'astro-pwa'

const fields = z.object({
    first_name: z.string().minLength(2),
    last_name: z.string().minLength(2),
    email: z.string().email()  
})

export interface Props {
  form: AstroForm<typeof fields>
}

const { form } = Astro.props
---
```

Now we can display validation errors in our form. First we'll show a general message:

```
<form id="example">
  {form.errors?.message && (
    <p><strong>{form.errors.message}</strong></p>
  )}

  <label for="first_name">First name</label>
  <input type="text" name="first_name" id="first_name" />

  <label for="last_name">Last name</label>
  <input type="text" name="last_name" id="last_name" />

  <label for="email">Email</label>
  <input type="email" name="email" id="email" />
</form>
```

Then we'll also display form level errors:

```
<form id="example">
  {form.errors?.message && (
    <p><strong>{form.errors.message}</strong></p>
  )}

  {form.errors?.form && (
    <ul>
    {form.errors.form.map(error => (
        <li>{error}</li>
    ))
    </ul>
  )}

  <label for="first_name">First name</label>
  <input type="text" name="first_name" id="first_name" />

  <label for="last_name">Last name</label>
  <input type="text" name="last_name" id="last_name" />

  <label for="email">Email</label>
  <input type="email" name="email" id="email" />
</form>
```

Finally we'll add field specific errors:

```
<form id="example">
  {form.errors?.message && (
    <p><strong>{form.errors.message}</strong></p>
  )}

  {form.errors?.form && (
    <ul>
    {form.errors.form.map(error => (
        <li>{error}</li>
    ))
    </ul>
  )}

  <label for="first_name">First name</label>
  <input type="text" name="first_name" id="first_name" />
  {form.errors?.fields?.first_name && (
    <p><strong>{form.errors.fields.first_name}</strong></p>
  )}

  <label for="last_name">Last name</label>
  <input type="text" name="last_name" id="last_name" />
  {form.errors?.fields?.first_name && (
    <p><strong>{form.errors.fields.last_name}</strong></p>
  )}

  <label for="email">Email</label>
  <input type="email" name="email" id="email" />
  {form.errors?.fields?.email && (
    <p><strong>{form.errors.fields.email}</strong></p>
  )}
</form>
```

Finally, we'll add a success message when our form submits successfully:

```
<form id="example">
  {form.success && (
    <p>Thanks for signing up!</p>
  )}

  {form.errors?.message && (
    <p><strong>{form.errors.message}</strong></p>
  )}

  {form.errors?.form && (
    <ul>
    {form.errors.form.map(error => (
        <li>{error}</li>
    ))
    </ul>
  )}

  <label for="first_name">First name</label>
  <input type="text" name="first_name" id="first_name" />
  {form.errors?.fields?.first_name && (
    <p><strong>{form.errors.fields.first_name}</strong></p>
  )}

  <label for="last_name">Last name</label>
  <input type="text" name="last_name" id="last_name" />
  {form.errors?.fields?.first_name && (
    <p><strong>{form.errors.fields.last_name}</strong></p>
  )}

  <label for="email">Email</label>
  <input type="email" name="email" id="email" />
  {form.errors?.fields?.email && (
    <p><strong>{form.errors.fields.email}</strong></p>
  )}
</form>
```

And that's our form! Now we need to add it to a page and setup the page to handle submissions. Assuming we have a page at `src/pages/index.astro`:

```
---
import { createForm } from 'astro-pwa'
import ExampleForm, { fields } from '../components/ExampleForm.astro'

const form = await createForm('example', { fields: fields: astro: Astro })

if (form.submitting) {
  form.submit((formData) => {
    // Do whatever you want with your form data in this function!
    // I.e, submit to a database, a third party service, etc
    console.log(formData)
  })
}
---
<html>
<head>
  <title>My Example Form</title>
</head>
<body>
  <ExampleForm />
</body>
</html>
```

And that's a wrap, that's your form!

## Forms without a page reload

You can prevent forms from reloading the page by wrapping forms in a `Frame`.

Going back to our example above, having a form reload on the page instead of reloading the whole page is as simple as doing:

```
---
import { createForm } from 'astro-pwa'
import Frame from 'astro-pwa'
import ExampleForm, { fields } from '../components/ExampleForm.astro'

const form = await createForm('example', { fields: fields: astro: Astro })

if (form.submitting) {
  form.submit((formData) => {
    // Do whatever you want with your form data in this function!
    // I.e, submit to a database, a third party service, etc
    console.log(formData)
  })
}
---
<html>
<head>
  <title>My Example Form</title>
</head>
<body>
  <Frame id="example_frame" server:isolate>
    <ExampleForm />
  </Frame>
</body>
</html>
```

## Submitting to another page route

You can create a form on one page that submits to another page route, or an API route. You do this by changing the `action` of your form:

```
<form id="example" action="/another-page">
```

For example, you can create an API route to handle your form submits. For example, by creating a page at `src/pages/api/example.js`:

```
export const post = async (context) => {
    const form = await createForm('example', { fields: fields, astro: Astro })

    if (form.submitting) {
        return form.submit(formData => {
            console.log(formData)
        })
    }

    return new Response(null, { statusCode: 204 })
}
```

And then update the `action` of your form to point to `/api/example`:

```
<form id="example" action="/api/example">
```

## Redirecting after a successful form submit

If you want to redirect to another page on successful submit of your form, you can redirect to another page by passing the `redirect` option to `createForm`:

```
import { createForm } from 'astro-pwa'

const form = await createForm('example', { fields: fields, astro: Astro, redirect: "/another-page" })
```
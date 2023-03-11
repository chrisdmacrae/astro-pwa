import type { APIRoute } from "astro";
import { useForm, z } from "astro-pwa";

export const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email()
})

export const post: APIRoute = async (context) => {
    const form = await useForm('test', { astro: context, schema: schema })

    if (form.submitting) {
        return form.submit(data => console.log({ data }))
    }

    return new Response(null, { status: 400 })
}
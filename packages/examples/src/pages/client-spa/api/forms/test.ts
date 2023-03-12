import type { APIRoute } from "astro";
import { useForm } from "astro-pwa";
// @ts-ignore
import { fields } from '../../../../components/astro/Form.astro'

export const post: APIRoute = async (context) => {
    const form = await useForm('test', { astro: context, fields: fields })

    if (form.submitting) {
        return form.submit(data => console.log({ data }))
    }

    return new Response(null, { status: 400 })
}
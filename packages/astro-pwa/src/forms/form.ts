import type { AstroGlobal } from "astro"
import type { z, typeToFlattenedError } from "zod"

export type AstroFormOptions<T extends AstroFormFields> = {
    astro: Pick<AstroGlobal, 'request' | 'redirect' | 'url'>
    fields?: T
    redirect?: string
}

export type AstroFormErrors<T extends AstroFormFields> = {
    message: string
    form?: string[]
    fields?: z.infer<T>
}

export type AstroFormFields = z.ZodType<Record<string, any>, any, any>

export type AstroForm<T extends AstroFormFields> = {
    id: string
    action: string
    submitting: boolean
    successful: boolean
    errors?: AstroFormErrors<T>
    fields?: T
    submit: (cb: (formData: z.infer<T>) => void | Promise<void>) => Promise<void> | Promise<Response>
}

export const submitForm = async <T extends AstroFormFields>(form: AstroForm<T>, values: FormData | Record<string, any>) => {
    const response = await fetch(form.action, {
        method: "POST",
        body: values instanceof FormData ? values : JSON.stringify(values),
        headers: {
            "Accept": "application/json"
        }
    })
    const json = await response.json()

    return json as AstroForm<T>['errors']
}

// TODO: XSRF
export const createForm = async <T extends AstroFormFields>(id: string, { astro, fields, redirect }: AstroFormOptions<T>): Promise<AstroForm<T>> => {
    const data = astro.request.method === 'POST' ? await astro.request.json() : {}
    const error = astro.request.headers.get('__astro-form-error')
    const hasFormId = data['__astro-form'] === id || astro.request.headers.get('__astro-form') === id
    const isSubmitting = hasFormId || false
    const isSubmitted = astro.request.headers.get('__astro-form-submitted') === 'true'
    const isSuccessful = !error && isSubmitting && isSubmitted
    const url = astro.url.href

    const handleSuccess = async () => {
        if (redirect) return astro.redirect(redirect, 301)

        if (astro.request.headers.get('accept') === 'application/json') {
            return new Response(null, { status: 204, headers: { "Content-Type": "application/json" }})
        }
        
        const response = await fetch(url.toString(), { 
            method: "GET",
            headers: {
                '__astro-form': id,
                '__astro-form-submitted': 'true'
            }
        })
    
        return new Response(await response.text(), { status: 200, headers: { "Content-Type": "text/html" } })
    }

    const handleError = async (message: string, errors?: typeToFlattenedError<any>) => {
        const errorPayload = JSON.stringify({
            message,
            form: errors?.formErrors,
            fields: errors?.fieldErrors
        })

        if (astro.request.headers.get('accept') === 'application/json') {
            return new Response(errorPayload, { status: 200, headers: { "Content-Type": "application/json" }})
        }

        const errorResponse = await fetch(url.toString(), { 
            method: "GET",
            headers: {
                '__astro-form': id,
                '__astro-form-error': errorPayload
            }
        })
    
        return new Response(await errorResponse.text(), { status: 200, headers: { "Content-Type": "text/html" } })
    }

    const submit = async (cb: (formData: T) => void | Promise<void>) => {
        try {
            if (!data) {
                return new Response(null, { status: 400 })
            }

            if (fields) {
                const validation = fields.safeParse(data)

                if (!validation.success) return handleError("Form is not valid", validation.error.flatten())
            }

            await cb(data)
            
            return handleSuccess()
        }
        catch (error) {
            return handleError((error as Error).message)
        }
    }

    return {
        id,
        action: astro.url.href,
        submitting: isSubmitting && !isSubmitted && !error,
        successful: isSuccessful,
        errors: error ? JSON.parse(error) : null,
        fields,
        submit
    }
}
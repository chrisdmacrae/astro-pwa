import type { AstroGlobal } from "astro"
import type { z, typeToFlattenedError } from "zod"

export type AstroFormOptions<T extends AstroFormFields> = {
    astro: Pick<AstroGlobal, 'request' | 'redirect' | 'url'> & { cookies: any }
    fields?: T
    redirect?: string
}

export type AstroFormErrors<T extends AstroFormFields> = {
    message: string
    form?: string[]
    fields?: z.infer<T>
}

export type AstroFormFields<T = Record<string, any> | { [k: string]: FormDataEntryValue }> = z.ZodType<T, any, any>

export type AstroForm<T extends AstroFormFields> = {
    id: string
    action: string
    submitting: boolean
    successful: boolean
    data?: z.infer<T>
    errors?: AstroFormErrors<T>
    fields?: T
    submit: (cb: (formData: z.infer<T>) => void | Promise<void>) => Promise<Response>
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
export const createForm = async <T extends Record<string, any> | { [k: string]: FormDataEntryValue }, F extends AstroFormFields = AstroFormFields<T>>(id: string, { astro, fields, redirect }: AstroFormOptions<F>): Promise<AstroForm<F>> => {
    const headerData = astro.request.headers.get('__astro-form-data')

    let data = {} as T
    if (astro.request.method === "POST" && (astro.request.headers.get('accept') === 'application/json' || astro.request.headers.get('content-type') === 'application/json')) {
        data = await astro.request.json()
    }
    else if (astro.request.method === "POST") {
        const formData = await astro.request.formData()

        data = Object.fromEntries(formData) as T
    }
    else if (headerData) {
        data = JSON.parse(headerData)
    }

    const url = astro.url.href
    const hasFormId = data['__astro-form'] === id || astro.request.headers.get('__astro-form') === id
    const isSubmitting = hasFormId || false
    const error = astro.request.headers.get('__astro-form-error')
    const isSubmitted = astro.request.headers.get('__astro-form-submitted') === 'true'
    const isSuccessful = !error && isSubmitting && isSubmitted

    const session = astro.cookies.get('session').value

    if (session) {
        astro.cookies.set('session', session)
    }

    const handleSuccess = async () => {
        if (redirect) return astro.redirect(redirect, 301)

        if (astro.request.headers.get('accept') === 'application/json') {
            return new Response(null, { status: 204, headers: { "Content-Type": "application/json" }})
        }
        
        const response = await fetch(url.toString(), { 
            method: "GET",
            headers: {
                ...astro.request.headers,
                cookie: Array.from(astro.cookies.headers()).join('; '),
                '__astro-form': id,
                '__astro-form-submitted': 'true',
                '__astro-form-data': JSON.stringify(data)
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
                ...astro.request.headers,
                cookie: Array.from(astro.cookies.headers()).join('; '),
                '__astro-form': id,
                '__astro-form-error': errorPayload,
                '__astro-form-data': JSON.stringify(data)
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
        data,
        fields,
        errors: error ? JSON.parse(error) : null,
        submit
    }
}
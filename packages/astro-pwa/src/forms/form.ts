import type { AstroGlobal } from "astro"
import type { z, typeToFlattenedError } from "zod"

export type FormOptions<T extends z.ZodType> = {
    astro: Pick<AstroGlobal, 'request' | 'redirect' | 'url'>
    fields?: T
    redirect?: string
}

export type FormErrors<T extends z.ZodType> = {
    message: string
    form?: string[]
    fields?: z.infer<T>
}

export type AstroForm<T extends z.ZodType> = {
    submitting: boolean,
    successful: boolean
    error?: FormErrors<T>
    submit: (cb: (formData: z.infer<T>) => void) => Promise<Response>
}

// TODO: XSRF
export const useForm = async <T extends z.ZodType = any>(id: string, { astro, fields, redirect }: FormOptions<T>): Promise<AstroForm<T>> => {
    const data = astro.request.method === 'POST' ? await astro.request.formData() : new FormData()
    const referrerUrl = data.get('referrer')
    const error = astro.request.headers.get('__astro-form-error')
    const isSubmitting = data.get('__astro-form') === id || astro.request.headers.get('__astro-form') === id || false
    const isSubmitted = astro.request.headers.get('__astro-form-submitted') === 'true'
    const isSuccessful = !error && isSubmitting && isSubmitted
    const url = referrerUrl || astro.url.href

    const handleSuccess = async () => {
        if (redirect) return astro.redirect(redirect, 301)

        const response = await fetch(url.toString(), { method: "GET", headers: {
            '__astro-form': id,
            '__astro-form-submitted': 'true'
        }})

        return new Response(await response.text(), { status: response.status, headers: { "Content-Type": "text/html" } })
    }

    const handleError = async (message: string, errors?: typeToFlattenedError<any>) => {
        const errorResponse = await fetch(url.toString(), { method: "GET", headers: {
            '__astro-form': id,
            '__astro-form-error': JSON.stringify({
                message,
                form: errors?.formErrors,
                fields: errors?.fieldErrors
            })
        }})
    
        return new Response(await errorResponse.text(), { status: 500, headers: { "Content-Type": "text/html" } })
    }

    return {
        submitting: isSubmitting && !isSubmitted && !error,
        successful: isSuccessful,
        error: error ? JSON.parse(error) : null,
        submit: async (cb: (formData: T) => void | Promise<void>) => {
            try {  
                const submission = serializeForm<T>(data)

                if (fields) {
                    const validation = fields.safeParse(submission)

                    if (!validation.success) return handleError("Form is not valid", validation.error.flatten())
                }

                await cb(submission)
                
                return handleSuccess()
            }
            catch (error) {
                return handleError((error as Error).message)
            }
        }
    }
}

const serializeForm = <T extends Record<string, any>>(form: FormData) => {
	let obj: Record<string, any> = {}
	for (let key of form.keys()) {
		obj[key] = form.get(key)
	}

	return obj as T
}
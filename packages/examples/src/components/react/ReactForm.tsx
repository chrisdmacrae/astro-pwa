import { Form, Field } from 'react-final-form'
import { FORM_ERROR } from 'final-form'
import { AstroForm, submitForm, z } from "astro-pwa"

export const fields = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email()
})

export type ReactFormProps = {
    form: AstroForm<typeof fields>
}

export const ReactForm: React.FC<ReactFormProps> = ({ form }) => {
    const onSubmit = async (values: z.infer<typeof fields>) => {
        const errors = await submitForm(form, values)

        if (errors) {
            return {
                ...errors.fields,
                [FORM_ERROR]: [errors.message, ...errors.form || []].join(', '),
            }
        }
    }

    return (
        <Form onSubmit={onSubmit}>
            {({handleSubmit, submitSucceeded, submitError}) => (
                <form id={form.id} onSubmit={handleSubmit} method="POST" className="flex flex-col gap-4">
                    {submitSucceeded && (
                        <h2>Thanks for submitting!</h2>
                    )}
                    {submitError && (
                        <p className="text-red-500">{submitError}</p>
                    )}
                    <Field name="__astro-form" type="hidden" defaultValue={form.id}>
                        {({input}) => (<input {...input} />)}
                    </Field>
                    <Field name="firstName" type="text" required>
                    {({input, meta }) => (
                        <div className="flex flex-col">
                            <label htmlFor={input.name}>First name</label>
                            <input {...input} id={input.name} className="px-5 py-3 border border-slate-100 rounded-lg shadow-md" />
                            {meta.error || meta.submitError && (<span className="text-red-500">{meta.error || meta.submitError}</span>)}
                        </div>
                    )}
                    </Field>
                    <Field name="lastName" type="text" required>
                    {({input, meta }) => (
                        <div className="flex flex-col">
                            <label htmlFor={input.name}>Last name</label>
                            <input {...input} id={input.name} className="px-5 py-3 border border-slate-100 rounded-lg shadow-md" />
                            {meta.error || meta.submitError && (<span className="text-red-500">{meta.error || meta.submitError}</span>)}
                        </div>
                    )}
                    </Field>
                    <Field name="email" type="email" required>
                    {({input, meta }) => (
                        <div className="flex flex-col">
                            <label htmlFor="firstName">Email</label>
                            <input {...input} id={input.name} className="px-5 py-3 border border-slate-100 rounded-lg shadow-md" />
                            {meta.error || meta.submitError && (<span className="text-red-500">{meta.error || meta.submitError}</span>)}
                        </div>
                    )}
                    </Field>
                    <button type="submit" class="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-xl text-white">Submit</button>
                </form>
            )}
        </Form>
    )
}
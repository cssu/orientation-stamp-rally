import { z } from 'zod'

const FormSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email can't be empty." })
        .max(100, { message: 'Email must be less than 100 characters.' })
        .email({ message: 'Input must be a valid email address.' })
})

export default FormSchema

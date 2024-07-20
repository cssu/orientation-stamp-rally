import { z } from 'zod'

const OTPFormSchema = z.object({
    otp: z.string().length(6, {
        message: 'Your one-time password must be 6 characters.'
    })
})

export default OTPFormSchema

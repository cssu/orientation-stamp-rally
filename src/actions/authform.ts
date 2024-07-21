'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import FormSchema from '@/schemas/loginform'
import redis from '@/lib/redis'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60

const ALLOWED_DOMAINS = new Set(['mail.utoronto.ca', 'utoronto.ca', 'cdf.utoronto.ca'])

type Message = {
    success: boolean
    maximumAttemptsReached?: boolean
    toastMessage?: { short: string; description: string }
    formMessage?: string
    otpGenerated: boolean
    timeLeftSeconds?: number
}

async function generateOTP(email: string): Promise<Message> {
    const lastGenerated = await redis.ephemeral.get(`${email}:lastGenerated`)
    if (lastGenerated) {
        return {
            success: true,
            otpGenerated: false,
            timeLeftSeconds: Math.ceil(120 - (Date.now() / 1000 - parseInt(lastGenerated))),
            maximumAttemptsReached: (await redis.ephemeral.get(`${email}:attempts`)) === '3'
        }
    }

    // const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()
    // console.log(generatedOTP)
    const generatedOTP = '111111'

    // 2 Minute expiry
    const unixSeconds = Date.now() / 1000
    await redis.ephemeral.set(`${email}:otp`, generatedOTP, 'EX', 2 * 60)
    await redis.ephemeral.set(`${email}:lastGenerated`, unixSeconds, 'EX', 2 * 60)
    await redis.ephemeral.set(`${email}:attempts`, 0, 'EX', 2 * 60)

    return {
        success: true,
        otpGenerated: true,
        toastMessage: {
            short: 'Check your email',
            description: 'A new OTP has been sent to your email.'
        }
    }
}

async function validateFormData(data: z.infer<typeof FormSchema>): Promise<Message> {
    try {
        FormSchema.parse(data)
    } catch (error) {
        return {
            success: false,
            otpGenerated: false,
            formMessage: 'Enter a valid email address.'
        }
    }

    const domain = data.email.split('@')[1]
    if (ALLOWED_DOMAINS.has(domain)) {
        return { success: true, otpGenerated: false }
    }

    const exemptedEmail = await prisma.exemptedEmail.findUnique({
        where: { email: data.email }
    })

    if (exemptedEmail === null) {
        return {
            success: false,
            otpGenerated: false,
            formMessage: 'Enter a valid UofT email address.',
            toastMessage: {
                short: 'Invalid Email',
                description:
                    'Please enter a valid UofT email address. If you do not have one, contact CSSU.'
            }
        }
    }

    return { success: true, otpGenerated: false }
}

export default async function authform(data: z.infer<typeof FormSchema>): Promise<Message> {
    data.email = data.email.toLowerCase()
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const emailValidation = await validateFormData(data)
    if (!emailValidation.success) {
        return emailValidation
    }

    if (!cookies().has('deviceId')) {
        cookies().set('deviceId', randomUUID(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: THIRTY_DAYS_SECONDS
        })
    }

    return generateOTP(data.email)
}

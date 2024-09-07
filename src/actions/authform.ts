'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import FormSchema from '@/schemas/loginform'
import redis from '@/lib/redis'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { ALLOWED_DOMAINS, OTP_EXPIRY_SECONDS } from '@/lib/constants'
import mail from '@/lib/mail'

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60

type Message = {
    success: boolean
    maximumAttemptsReached?: boolean
    toastMessage?: { short: string; description: string }
    formMessage?: string
    otpGenerated: boolean
    timeLeftSeconds?: number
}

async function sendOtp(email: string, otp: string) {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Generated OTP for ${email}: ${otp}`)
        return
    }

    console.log('OTP for email', email, otp)
    await mail
        .sendMail({
            from: 'CSSU <cssu@vm004.teach.cs.toronto.edu>',
            to: email,
            subject: 'Your one-time password for CSSU Orientation Portal',
            text: `Your one-time password for the CSSU Orientation Portal is: ${otp}. This OTP will expire in ${OTP_EXPIRY_SECONDS} seconds.`,
            html: `
        <p>Your one-time password for the CSSU Orientation Portal is:</p>
        <h1>${otp}</h1>
        <p>Good luck on the stamp hunt! 😊</p>
        <p>-CSSU</p>
        <p><i>(This one-time password will expire in ${OTP_EXPIRY_SECONDS} seconds)</i></p>
        <img src="https://www.cssu.ca/nextImageExportOptimizer/horizontal_logo_black.4f2d58d3-opt-3840.WEBP" style="width: 260px" />
        `
        })
        .catch((error) => {
            console.error('Error sending OTP:', error)
            throw new Error('Error sending OTP')
        })
}

async function generateOTP(email: string): Promise<Message> {
    const lastGenerated = await redis.ephemeral.get(`${email}:lastGenerated`)
    if (lastGenerated) {
        return {
            success: true,
            otpGenerated: false,
            timeLeftSeconds: Math.ceil(
                OTP_EXPIRY_SECONDS - (Date.now() / 1000 - parseInt(lastGenerated))
            ),
            maximumAttemptsReached: (await redis.ephemeral.get(`${email}:attempts`)) === '3'
        }
    }

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()

    // 2 Minute expiry
    const unixSeconds = Date.now() / 1000
    await redis.ephemeral.set(`${email}:otp`, generatedOTP, 'EX', OTP_EXPIRY_SECONDS)
    await redis.ephemeral.set(`${email}:lastGenerated`, unixSeconds, 'EX', OTP_EXPIRY_SECONDS)
    await redis.ephemeral.set(`${email}:attempts`, 0, 'EX', OTP_EXPIRY_SECONDS)

    await sendOtp(email, generatedOTP).catch(() => {
        return {
            success: false,
            otpGenerated: false,
            toastMessage: {
                short: 'Error sending OTP',
                description:
                    'An error occurred while sending the OTP. Contact CSSU or try again later.'
            }
        }
    })

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

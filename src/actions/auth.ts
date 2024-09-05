'use server'

import prisma from '@/lib/prisma'
import redis from '@/lib/redis'
import { cookies, headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import OTPFormSchema from '@/schemas/otpform'
import { randomUUID, randomBytes } from 'crypto'
import {
    JWT_EXPIRY,
    JWT_EXPIRY_MILISECONDS,
    OTP_EXPIRY_SECONDS
} from '@/lib/constants'

const MAX_SUPPORTED_SESSIONS = 4
const MAX_OTP_ATTEMPTS = 3

type LoginResult = {
    success: boolean
    maximumAttemptsReached?: boolean
    toastMessage?: {
        short: string
        description: string
    }
    formMessage?: string
}

function generateAcessToken(userId: string, email: string, role: string): string {
    return jwt.sign({ userId, email, role }, process.env.JWT_SECRET!, {
        expiresIn: JWT_EXPIRY
    })
}

function generateRefreshToken(): string {
    return randomBytes(32).toString('hex')
}

function getTimeLeftSeconds(lastGenerated: number): number {
    return Math.ceil(OTP_EXPIRY_SECONDS - (Date.now() / 1000 - lastGenerated))
}

export async function login(email: string, otp: string): Promise<LoginResult> {
    try {
        OTPFormSchema.parse({ otp })
    } catch (error) {
        return {
            success: false,
            formMessage: 'Invalid OTP format'
        }
    }

    let deviceId = cookies().get('deviceId')?.value
    if (!deviceId) {
        deviceId = randomUUID()
        cookies().set('deviceId', deviceId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
    }

    const [attempts, storedOtp] = await Promise.all([
        redis.ephemeral.get(`${email}:attempts`),
        redis.ephemeral.get(`${email}:otp`)
    ])

    if (storedOtp === null && attempts !== null) {
        // attemps !== null IMPLIES storedOtp === null AND lastGenerated !== null.
        // There is still a null check there, however.
        const lastGenerated = await redis.ephemeral.get(`${email}:lastGenerated`)
        return {
            success: false,
            maximumAttemptsReached: true,
            toastMessage: {
                short: 'Too Many Attempts',
                description: `You have exceeded the maximum number of attempts. Please request a new OTP in ${
                    lastGenerated ? getTimeLeftSeconds(parseInt(lastGenerated)) : OTP_EXPIRY_SECONDS
                } seconds.`
            },
            formMessage: 'Too many attempts. Please request a new OTP.'
        }
    }

    if (storedOtp === null || attempts === null) {
        return {
            success: false,
            formMessage: 'OTP expired. Please request a new one.',
            toastMessage: {
                short: 'OTP Expired',
                description: 'The OTP has expired. Please request a new one.'
            }
        }
    }

    if (storedOtp !== otp) {
        const incremented = await redis.ephemeral.incr(`${email}:attempts`)
        if (incremented === MAX_OTP_ATTEMPTS) {
            const [, lastGenerated] = await Promise.all([
                redis.ephemeral.del(`${email}:otp`),
                redis.ephemeral.get(`${email}:lastGenerated`)
            ])

            return {
                success: false,
                maximumAttemptsReached: true,
                toastMessage: {
                    short: 'Too Many Attempts',
                    description: `You have exceeded the maximum number of attempts. Please request a new OTP in ${
                        lastGenerated
                            ? getTimeLeftSeconds(parseInt(lastGenerated))
                            : OTP_EXPIRY_SECONDS
                    } seconds.`
                }
            }
        }

        const remaining = MAX_OTP_ATTEMPTS - incremented
        return {
            success: false,
            toastMessage: {
                short: 'Invalid OTP',
                description: `You have entered an invalid OTP. You have ${remaining} attempt${
                    remaining !== 1 ? 's' : ''
                } left.`
            },
            formMessage: 'Invalid OTP. Please try again.'
        }
    }

    await Promise.all([
        redis.ephemeral.del(`${email}:otp`),
        redis.ephemeral.del(`${email}:lastGenerated`),
        redis.ephemeral.del(`${email}:attempts`)
    ])

    let user = await prisma.user.findUnique({
        where: { email }
    })

    if (user === null) {
        // A new account is being created
        user = await prisma.user.create({
            data: { email }
        })
    }

    const accessToken = generateAcessToken(user.userId, user.email, user.role)
    const refreshToken = generateRefreshToken()

    const userAgent = headers().get('User-Agent') || 'unknown'
    const platform = headers().get('Sec-Ch-Ua-Platform') || 'unknown'

    await prisma.$transaction(async (tx) => {
        // Check if a refresh token for this device already exists
        const existingToken = await tx.refreshToken.findUnique({
            where: {
                userId_deviceId: {
                    userId: user.userId,
                    deviceId: deviceId
                }
            }
        })

        if (existingToken) {
            // We don't have to blacklist refresh tokens, because in authorization we already check
            // if the token is in the DB.
            await tx.refreshToken.update({
                where: { token: existingToken.token },
                data: { token: refreshToken, createdAt: new Date() }
            })
        } else {
            await tx.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: user.userId,
                    deviceId: deviceId,
                    userAgent,
                    platform
                }
            })
        }

        const userTokens = await tx.refreshToken.findMany({
            where: { userId: user.userId },
            orderBy: { createdAt: 'desc' }
        })

        if (userTokens.length > MAX_SUPPORTED_SESSIONS) {
            const tokensToRemove = userTokens.slice(MAX_SUPPORTED_SESSIONS)
            for (const token of tokensToRemove) {
                // We don't have to blacklist refresh tokens, because in authorization we already check
                // if the token is in the DB.
                await tx.refreshToken.delete({ where: { token: token.token } })
            }
        }
    })

    cookies().set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + JWT_EXPIRY_MILISECONDS)
    })

    cookies().set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    })

    return {
        success: true
    }
}

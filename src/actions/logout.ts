'use server'

import redis from '@/lib/redis'
import { JWT_EXPIRY_MILISECONDS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export default async function logout(refreshToken: string) {
    cookies().delete('refreshToken')
    await prisma.refreshToken.delete({
        where: {
            token: refreshToken
        }
    })

    const accessToken = cookies().get('accessToken')?.value
    if (accessToken) {
        cookies().delete('accessToken')
    }

    await redis.persistent.set(
        `blacklist:${refreshToken}`,
        'true',
        'EX',
        JWT_EXPIRY_MILISECONDS / 1000
    )
}

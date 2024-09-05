'use server'

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

/// Assumes that the user is authenticated, returns null otherwise.
export async function currentUser() {
    const accessToken = cookies().get('accessToken')?.value

    if (!accessToken) {
        console.error('No access token found in provider')
        return null
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
            userId: string
            email: string
            role: string
        }

        return await prisma.user
            .findUnique({
                where: { userId: decoded.userId },
                select: {
                    userId: true,
                    email: true,
                    role: true,
                    organizationId: true,
                    organization: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching user from DB:', error)
                return null
            })
    } catch (error) {
        console.error('Error decoding access token:', error)
        return null
    }
}

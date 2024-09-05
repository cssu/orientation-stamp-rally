import prisma from './prisma'
import jwt from 'jsonwebtoken'
import { JWT_EXPIRY } from './constants'

export async function isRefreshTokenValid(refreshToken: string): Promise<boolean> {
    const refreshTokenObject = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        select: { expiresAt: true }
    })

    if (!refreshTokenObject) return false

    const isValid = refreshTokenObject.expiresAt.getTime() > Date.now()

    // If refresh token is invalid, delete it from the database: this helps with cleanup, but it isn't necessary.
    if (!isValid) {
        await prisma.refreshToken.delete({ where: { token: refreshToken } })
    }

    return isValid
}

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        })

        if (!storedToken) {
            return null
        }

        // If the refresh token has expired:
        if (new Date() > storedToken.expiresAt) {
            await prisma.refreshToken.delete({ where: { token: refreshToken } })
            return null
        }

        // Generate a new access token:
        const newAccessToken = jwt.sign(
            {
                userId: storedToken.user.userId,
                email: storedToken.user.email,
                role: storedToken.user.role
            },
            process.env.JWT_SECRET!,
            { expiresIn: JWT_EXPIRY }
        )

        return newAccessToken
    } catch (error) {
        console.error('Error refreshing access token:', error)
        return null
    }
}

export function isTokenValid(token: string): boolean {
    try {
        // jwt.verify already checks if the token is expired
        jwt.verify(token, process.env.JWT_SECRET!)

        // Additional checks? User exists, role changed, etc. Role change is
        // one concern in this function, but since roles are manually assigned
        // this should not be a problem.

        return true
    } catch (error) {
        return false
    }
}

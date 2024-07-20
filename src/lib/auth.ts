import prisma from './prisma'

export async function isRefreshTokenValid(refreshToken: string): Promise<boolean> {
    const refreshTokenObject = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        select: { expiresAt: true }
    })

    if (!refreshTokenObject) return false

    return refreshTokenObject.expiresAt.getTime() > Date.now()
}

import { NextResponse, type NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const accessToken = searchParams.get('accessToken')

    if (!accessToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
            userId: string
            email: string
            role: string
        }

        const user = await prisma.user.findUnique({
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

        return NextResponse.json({ user })
    } catch (error) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
}

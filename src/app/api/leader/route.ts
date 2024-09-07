import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'
import redis from '@/lib/redis'

export async function POST(req: NextRequest) {
    const payload = crypto.randomUUID()
    const timestamp = new Date().toISOString()

    const accessToken = req.cookies.get('accessToken')?.value
    if (!accessToken) {
        return NextResponse.json({ message: 'No access token found. Log in again.' })
    }

    const decoded = jwt.decode(accessToken) as { userId: string }

    const boothId = await prisma.user
        .findUnique({
            where: { userId: decoded.userId },
            select: {
                organization: {
                    select: {
                        booths: {
                            select: {
                                boothId: true
                            }
                        }
                    }
                }
            }
        })
        // TODO: Right now, every organization has only one booth. This may change in the future.
        .then((org) => org!.organization!.booths[0]!.boothId)

    const qrData = {
        payload,
        timestamp
    }

    await redis.ephemeral.set(`qr:${boothId}`, JSON.stringify(qrData), 'EX', 10)

    const qr = `${process.env.URL}/api/visit?qr=${encodeURIComponent(payload)}&boothId=${boothId}`

    return NextResponse.json({ qr })
}

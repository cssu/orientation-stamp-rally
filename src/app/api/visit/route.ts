import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import redis from '@/lib/redis'
import jwt from 'jsonwebtoken'
import { DecodedJwt } from '@/lib/types'

const QR_SCAN_PERIOD = 15000

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const receivedPayload = searchParams.get('qr')
    const boothId = searchParams.get('boothId')

    const accessToken = req.cookies.get('accessToken')?.value
    if (!accessToken) {
        return NextResponse.redirect(process.env.URL + '/scanned?validity=1')
    }

    if (!receivedPayload || !boothId) {
        return NextResponse.redirect(process.env.URL + '/scanned?validity=2')
    }

    const redisData = await redis.ephemeral.get(`qr:${boothId}`)

    if (!redisData) {
        return NextResponse.redirect(process.env.URL + '/scanned?validity=3')
    }

    const { payload, timestamp } = JSON.parse(redisData)

    if (decodeURIComponent(receivedPayload) != payload) {
        return NextResponse.redirect(process.env.URL + '/scanned?validity=3')
    }

    const currentTime = new Date().getTime()
    const qrGenerationTime = new Date(timestamp).getTime()

    if (currentTime - qrGenerationTime > QR_SCAN_PERIOD) {
        return NextResponse.redirect(process.env.URL + '/scanned?validity=3')
    }

    const decoded = jwt.decode(accessToken) as DecodedJwt

    const existingStamp = await prisma.stamp.findFirst({
        where: {
            userId: decoded.userId,
            boothId: boothId
        }
    })
    
    if (existingStamp) {
        return NextResponse.redirect(process.env.URL + '/scanned?validity=4')
    }
    
    await prisma.stamp.create({
        data: {
            user: {
                connect: { userId: decoded.userId }
            },
            booth: {
                connect: { boothId: boothId }
            }
        }
    })

    return NextResponse.redirect(process.env.URL + '/scanned?validity=5')
}

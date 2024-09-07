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

    if (!receivedPayload) {
        return NextResponse.json({ valid: false, message: 'Missing payload' })
    }

    if (!boothId) {
        return NextResponse.json({ valid: false, message: 'Missing boothId' })
    }

    const redisData = await redis.ephemeral.get(`qr:${boothId}`)

    if (!redisData) {
        return NextResponse.json({ valid: false, message: 'QR code not found' })
    }

    const { payload, timestamp } = JSON.parse(redisData)

    if (decodeURIComponent(receivedPayload) != payload) {
        return NextResponse.json({ valid: false, message: 'Invalid QR code' })
    }

    const currentTime = new Date().getTime()
    const qrGenerationTime = new Date(timestamp).getTime()

    if (currentTime - qrGenerationTime > QR_SCAN_PERIOD) {
        return NextResponse.json({ valid: false, message: 'QR code expired' })
    }

    const accessToken = req.cookies.get('accessToken')?.value
    if (!accessToken) {
        return NextResponse.json({ valid: false, message: 'No access token found. Log in again.' })
    }

    const decoded = jwt.decode(accessToken) as DecodedJwt

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

    return NextResponse.redirect(process.env.URL + '/dashboard')
}

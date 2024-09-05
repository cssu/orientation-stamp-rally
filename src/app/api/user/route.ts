import { isRefreshTokenValid, refreshAccessToken } from '@/lib/auth'
import { NextResponse, type NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const accessToken = searchParams.get('accessToken')

    if (!accessToken) {
        return NextResponse.json({ message: 'Invalid access token' }, { status: 401 })
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!)
}

import { isTokenValid } from '@/lib/auth'
import { NextResponse, type NextRequest } from 'next/server'

export function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const accessToken = searchParams.get('accessToken')

    if (!accessToken) {
        return NextResponse.json({ message: 'Invalid access token' }, { status: 401 })
    } else {
        const accessTokenIsValid = isTokenValid(accessToken)
        return NextResponse.json({ accessTokenIsValid })
    }
}

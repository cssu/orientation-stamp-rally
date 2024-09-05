import { isRefreshTokenValid, refreshAccessToken } from '@/lib/auth'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const refreshToken = searchParams.get('refreshToken')

    if (!refreshToken) {
        return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 })
    } else {
        if (!(await isRefreshTokenValid(refreshToken))) {
            return NextResponse.json({ accessToken: null })
        }

        const newAccessToken = await refreshAccessToken(refreshToken)
        return NextResponse.json({ accessToken: newAccessToken })
    }
}

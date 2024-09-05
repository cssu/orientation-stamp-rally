import { isRefreshTokenValid, refreshAccessToken } from '@/lib/auth'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    const refreshToken = req.cookies.get('refreshToken')?.value

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

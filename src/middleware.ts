import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        const tokenIsValid =
            accessToken !== undefined &&
            (await fetch(process.env.URL + '/api/verify-access-token?accessToken=' + accessToken)
                .then((res) => res.json())
                .then((data) => data.accessTokenIsValid))

        if (tokenIsValid) {
            return NextResponse.next()
        } else if (refreshToken) {
            console.log('refreshing access token')
            // If access token is invalid but refresh token exists, try to refresh
            // const newAccessToken = await refreshAccessToken(refreshToken)
            const newAccessToken = await fetch(
                process.env.URL + '/api/refresh-access-token?refreshToken=' + refreshToken
            )
                .then((res) => res.json())
                .then((data) => data.accessToken)

            if (newAccessToken) {
                console.log('received new access token')
                const response = NextResponse.next()
                response.cookies.set('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                })
                return response
            } // Else, newAccessToken is null, redirect to /. This means the refresh token is invalid.
        }

        // All else fails, redirect to /
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/api/:path*']
}

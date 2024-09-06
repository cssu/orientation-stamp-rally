import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    const tokenIsValid =
        accessToken !== undefined &&
        (await fetch(process.env.URL + '/api/verify-access-token', {
            headers: {
                cookie: 'accessToken=' + accessToken
            }
        })
            .then((res) => res.json())
            .then((data) => data.accessTokenIsValid))

    if (tokenIsValid) {
        return NextResponse.next()
    } else if (refreshToken) {
        // If access token is invalid but refresh token exists, try to refresh
        const newAccessToken = await fetch(process.env.URL + '/api/refresh-access-token', {
            headers: {
                cookie: 'refreshToken=' + refreshToken
            },
            method: 'POST'
        })
            .then((res) => res.json())
            .then((data) => data.accessToken)
        if (newAccessToken) {
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

export const config = {
    matcher: ['/dashboard/:path*', '/api/user']
}

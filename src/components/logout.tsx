'use client'

import logout from '@/actions/logout'

interface LogoutProps {
    refreshToken: string
}

export default function Logout({ refreshToken }: LogoutProps) {
    return (
        <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300 bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 py-2"
            onClick={async () => {
                await logout(refreshToken)

                window.location.reload()
            }}
        >
            Logout
        </button>
    )
}

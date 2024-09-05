'use client'

import { createContext } from 'react'
import type { UserRole } from '@prisma/client'

interface UserProviderProps {
    children: React.ReactNode
    user: MinimalUser
}

type MinimalUser = {
    userId: string
    email: string
    role: UserRole
    organizationId: string | null
    organization: {
        name: string
    } | null
}

export const UserContext = createContext<MinimalUser | null>(null)

export default function UserProvider({ children, user }: UserProviderProps) {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

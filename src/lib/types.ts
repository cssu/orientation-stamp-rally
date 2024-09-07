import { type UserRole } from '@prisma/client'

export type DecodedJwt = {
    userId: string
    email: string
    role: UserRole
}

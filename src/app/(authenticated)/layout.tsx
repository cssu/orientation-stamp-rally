import { currentUser } from '@/actions/user'
import UserProvider from '@/components/providers/UserProvider'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await currentUser()

    return <UserProvider user={user!}>{children}</UserProvider>
}

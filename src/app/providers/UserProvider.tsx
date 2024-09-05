import { createContext, useEffect, useState } from 'react'
import type { User } from '@prisma/client'

interface UserProviderProps {
    children: React.ReactNode
}

export const UserContext = createContext<User | null>(null)

export default function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {}, [])

    const setUserData = (data: User) => {
        setUser(data)
    }

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

// export const AccountContext = createContext<AccountContextProps | undefined>(undefined)

// export default function AccountProvider({ children }: { children: React.ReactNode }) {
//     const [account, setAccountState] = useState<Account | null>(null)

//     useEffect(() => {
//         const accountData = localStorage.getItem("account")

//         if (accountData) {
//             setAccountState(JSON.parse(accountData))
//         }
//     }, [])

//     // Return whether an error occured
//     const setAddress = async (value: string, addressType: "ens" | "address"): Promise<boolean> => {
//         try {
//             const accountData = await AccountMetadata.getMetadata(value, addressType)
//             setAccountState(accountData)

//             localStorage.setItem("account", JSON.stringify(accountData))

//             return false
//         } catch (error) {
//             setAccountState(null)
//             return true
//         }
//     }

//     return (
//         <AccountContext.Provider value={{ account, setAddress, setAccount: setAccountState }}>
//             {children}
//         </AccountContext.Provider>
//     )
// }

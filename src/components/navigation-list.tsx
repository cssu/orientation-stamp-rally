import { cn } from '@/lib/utils'
import { Icons } from './icons'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import React from 'react'
import Link from 'next/link'
import Login from './login'
import { isRefreshTokenValid } from '@/lib/auth'
import { cookies } from 'next/headers'
import { DarkModeToggle } from './dark-mode-toggle'
import Logout from './logout'

export default async function NavigationList() {
    const refreshToken = cookies().get('refreshToken')?.value
    const refreshTokenIsValid = refreshToken ? await isRefreshTokenValid(refreshToken) : false

    return (
        <NavigationMenu>
            <NavigationMenuList className="space-x-4">
                <NavigationMenuItem>
                    <DarkModeToggle />
                </NavigationMenuItem>
                <NavigationMenuItem>
                    {refreshTokenIsValid ? (
                        <div className="flex space-x-4">
                            <Logout refreshToken={refreshToken!} />
                            <Link href="/dashboard" legacyBehavior passHref>
                                <NavigationMenuLink className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300 bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 py-2">
                                    Dashboard
                                </NavigationMenuLink>
                            </Link>
                        </div>
                    ) : (
                        <Login size="default" />
                    )}
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </a>
                </NavigationMenuLink>
            </li>
        )
    }
)
ListItem.displayName = 'ListItem'

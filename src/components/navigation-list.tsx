import { cn } from '@/lib/utils'
import { Icons } from './icons'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import React from 'react'
import Link from 'next/link'
import Login from './login'
import { isRefreshTokenValid } from '@/lib/auth'
import { cookies } from 'next/headers'
import { DarkModeToggle } from './dark-mode-toggle'

export default async function NavigationList() {
    const refreshToken = cookies().get('refreshToken')?.value
    const refreshTokenIsValid = refreshToken ? await isRefreshTokenValid(refreshToken) : false

    return (
        <NavigationMenu>
            <NavigationMenuList className='space-x-4'>
                <NavigationMenuItem>
                    <DarkModeToggle />
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-background">
                        Lipsum Sit Amet
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <Icons.logo className="h-6 w-6" />
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            lorem ipsum
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
                                            ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/docs" title="Introduction">
                                ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                            </ListItem>
                            <ListItem href="/docs/installation" title="Installation">
                                ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                            </ListItem>
                            <ListItem href="/docs/primitives/typography" title="Typography">
                                ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                {/* <NavigationMenuItem>
                    <Link href="/docs" legacyBehavior passHref>
                        <NavigationMenuLink
                            className={cn(navigationMenuTriggerStyle(), 'bg-background')}
                        >
                            Blablabla
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem> */}
                <NavigationMenuItem>
                    {refreshTokenIsValid ? (
                        <Link href="/dashboard" legacyBehavior passHref>
                            <NavigationMenuLink className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300 bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 py-2">
                                Dashboard
                            </NavigationMenuLink>
                        </Link>
                    ) : (
                        <Login />
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

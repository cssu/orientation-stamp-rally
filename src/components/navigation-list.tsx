import { cn } from '@/lib/utils'
import { Icons } from './icons'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import Login from './login'

export default function NavigationList() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Lipsum Sit Amet</NavigationMenuTrigger>
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
                <NavigationMenuItem>
                    <Link href="/docs" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Blablabla
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Login />
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

import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import Link from 'next/link'

import {
    AlertCircle,
    Archive,
    ArchiveX,
    File,
    Inbox,
    MessagesSquare,
    Search,
    Send,
    ShoppingCart,
    Trash2,
    Users2
} from 'lucide-react'

export default function Dashboard() {
    return (
        <TooltipProvider delayDuration={0}>
            <div className="flex grow items-stretch flex-row justify-betweenflex h-full p-4">
                <div className="w-64 h-full">
                    <Separator />
                    <Nav
                        links={[
                            {
                                title: 'Inbox',
                                label: '128',
                                icon: Inbox,
                                variant: 'default'
                            },
                            {
                                title: 'Drafts',
                                label: '9',
                                icon: File,
                                variant: 'ghost'
                            },
                            {
                                title: 'Sent',
                                label: '',
                                icon: Send,
                                variant: 'ghost'
                            },
                            {
                                title: 'Junk',
                                label: '23',
                                icon: ArchiveX,
                                variant: 'ghost'
                            },
                            {
                                title: 'Trash',
                                label: '',
                                icon: Trash2,
                                variant: 'ghost'
                            },
                            {
                                title: 'Archive',
                                label: '',
                                icon: Archive,
                                variant: 'ghost'
                            }
                        ]}
                    />
                    <Separator />
                    <Nav
                        links={[
                            {
                                title: 'Social',
                                label: '972',
                                icon: Users2,
                                variant: 'ghost'
                            },
                            {
                                title: 'Updates',
                                label: '342',
                                icon: AlertCircle,
                                variant: 'ghost'
                            },
                            {
                                title: 'Forums',
                                label: '128',
                                icon: MessagesSquare,
                                variant: 'ghost'
                            },
                            {
                                title: 'Shopping',
                                label: '8',
                                icon: ShoppingCart,
                                variant: 'ghost'
                            },
                            {
                                title: 'Promotions',
                                label: '21',
                                icon: Archive,
                                variant: 'ghost'
                            }
                        ]}
                    />
                </div>
                <div className="flex-grow px-4 border border-red-500">
                    <Tabs defaultValue="all">
                        <div className="flex items-center px-4 py-2">
                            <h1 className="text-xl font-bold">Inbox</h1>
                            <TabsList className="ml-auto">
                                <TabsTrigger
                                    value="all"
                                    className="text-zinc-600 dark:text-zinc-200"
                                >
                                    All mail
                                </TabsTrigger>
                                <TabsTrigger
                                    value="unread"
                                    className="text-zinc-600 dark:text-zinc-200"
                                >
                                    Unread
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <Separator />
                        <TabsContent value="all" className="m-0">
                            {/* <MailList items={mails} /> */}
                            234234234243
                        </TabsContent>
                        <TabsContent value="unread" className="m-0">
                            {/* <MailList items={mails.filter((item) => !item.read)} /> */}
                            342432423
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </TooltipProvider>
    )
}

function Nav({ links, isCollapsed }: any) {
    return (
        <div className="group flex flex-col gap-4 py-2 h-full">
            <nav className="grid gap-2 px-4 group-[[data-collapsed=true]]:justify-center">
                {links.map((link: any, index: any) =>
                    isCollapsed ? (
                        <Tooltip key={index} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Link
                                    href="#"
                                    className={cn(
                                        buttonVariants({ variant: link.variant, size: 'icon' }),
                                        'h-12 w-12',
                                        link.variant === 'default' &&
                                            'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                                    )}
                                >
                                    <link.icon className="h-6 w-6" />
                                    <span className="sr-only">{link.title}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="flex items-center gap-4">
                                {link.title}
                                {link.label && (
                                    <span className="ml-auto text-muted-foreground">
                                        {link.label}
                                    </span>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Link
                            key={index}
                            href="#"
                            className={cn(
                                buttonVariants({ variant: link.variant, size: 'lg' }),
                                link.variant === 'default' &&
                                    'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                                'justify-start'
                            )}
                        >
                            <link.icon className="mr-4 h-6 w-6" />
                            {link.title}
                            {link.label && (
                                <span
                                    className={cn(
                                        'ml-auto',
                                        link.variant === 'default' &&
                                            'text-background dark:text-white'
                                    )}
                                >
                                    {link.label}
                                </span>
                            )}
                        </Link>
                    )
                )}
            </nav>
        </div>
    )
}

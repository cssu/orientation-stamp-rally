import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@radix-ui/react-dropdown-menu'

import { cn } from '@/lib/utils'

import { HomeIcon, StampIcon } from 'lucide-react'
import { TabsList, TabsTrigger } from './ui/tabs'
import { UserRole } from '@prisma/client'

export default function DashboardNav({ role }: { role: UserRole }) {
    let links: { title: string; icon: any; variant: string; value: string }[] = []
    switch (role) {
        case 'participant':
            links = [
                {
                    title: 'Home',
                    icon: HomeIcon,
                    variant: 'ghost',
                    value: 'home'
                },
                {
                    title: 'Stamps',
                    icon: StampIcon,
                    variant: 'ghost',
                    value: 'stamps'
                }
            ]
            break
        case 'club_representative':
            links = [
                {
                    title: 'Home',
                    icon: HomeIcon,
                    variant: 'ghost',
                    value: 'home'
                },
                {
                    title: 'Booths',
                    icon: StampIcon,
                    variant: 'ghost',
                    value: 'booths'
                },
                // {
                //     title: 'Stamps',
                //     icon: StampIcon,
                //     variant: 'ghost',
                //     value: 'stamps'
                // }
            ]
            break
        default:
            links = []
    }

    return (
        <>
            <div className="dashboard-mobile w-full">
                <Separator />
                <TabsList className="group flex flex-row gap-4 py-2 px-4">
                    {links.map((link: any, index: any, value: any) => (
                        <TabsTrigger
                            className={cn(
                                buttonVariants({ variant: link.variant, size: 'lg' }),
                                link.variant === 'default' &&
                                    'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                                'flex items-center'
                            )}
                            key={index}
                            value={link.value}
                        >
                            <link.icon className="mr-2 h-6 w-6" />
                            {link.title}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <div className="w-64 dashboard-desktop h-full mt-8">
                <Separator />
                <TabsList className="group flex flex-col gap-4 py-2 h-full">
                    <nav className="grid gap-2 px-4">
                        {links.map((link: any, index: any, value: any) => (
                            <TabsTrigger
                                className={cn(
                                    buttonVariants({ variant: link.variant, size: 'lg' }),
                                    link.variant === 'default' &&
                                        'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                                    'justify-start'
                                )}
                                key={index}
                                value={link.value}
                            >
                                <link.icon className="mr-4 h-6 w-6" />
                                {link.title}
                            </TabsTrigger>
                        ))}
                    </nav>
                </TabsList>
            </div>
        </>
    )
}

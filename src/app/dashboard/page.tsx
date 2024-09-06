import { TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

import DashboardNav from '@/components/DashboardNav'

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { type UserRole } from '@prisma/client'

type DecodedJwt = {
    userId: string
    email: string
    role: UserRole
}

export default function Dashboard() {
    // Why the cookie must be present: This is ensured by the middleware
    const accessToken = cookies().get('accessToken')!.value

    const decoded = jwt.decode(accessToken) as DecodedJwt

    return (
        <TooltipProvider>
            <Tabs
                className="flex grow items-strech flex-row justify-between h-full p-4"
                defaultValue="home"
            >
                <DashboardNav role={decoded.role} />
                <div className="flex-grow px-4">
                    <DashboardContent decoded={decoded} />
                </div>
            </Tabs>
        </TooltipProvider>
    )
}

function DashboardContent({ decoded }: { decoded: DecodedJwt }) {
    switch (decoded.role) {
        case 'participant':
            return (
                <div>
                    <Separator />
                    <TabsContent value="home" className="m-0">
                        <DashboardHome {...decoded} />
                    </TabsContent>
                    <TabsContent value="stamps" className="m-0">
                        342432423
                    </TabsContent>
                </div>
            )
        case 'club_representative':
            return (
                <div>
                    <Separator />
                    <TabsContent value="home" className="m-0">
                        <DashboardHome {...decoded} />
                    </TabsContent>
                    <TabsContent value="booths" className="m-0">
                        342432423
                    </TabsContent>
                </div>
            )
        default:
            return null
    }
}

async function DashboardHome({ userId, email, role }: DecodedJwt) {
    const [nBoothsVisited, remainingBooths] = await prisma.$transaction([
        prisma.stamp.count({
            where: { userId }
        }),
        prisma.booth.count()
    ])

    if (role == 'participant') {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-extrabold">Welcome to CSSU Orientation!</h1>
                <br />
                <p className="text-xl font-medium">
                    {remainingBooths == 0
                        ? 'Congratulations! You have collected all stamps.'
                        : `You have visited ${nBoothsVisited} booths. You can still visit ${remainingBooths} booths!`}
                </p>
                <br />
                <h2 className="text-3xl font-semibold">How it Works:</h2>
                <p className="text-lg">
                    Visit each club booths and scan the QR code within 10 seconds to get a stamp.
                    Once
                    {'more details here'}
                </p>
            </div>
        )
    }

    return null
}
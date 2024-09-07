import { TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Tabs, TabsContent } from '@radix-ui/react-tabs'

import DashboardNav from '@/components/DashboardNav'

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { type UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import { isTokenValid, refreshAccessToken } from '@/lib/auth'
import DashboardBooths from '../../components/booths'
import { DecodedJwt } from '@/lib/types'
import Image from 'next/image'

export default async function Dashboard() {
    // Why the cookie must be present: This is ensured by the middleware. However,
    // The cookie might expire in the meantime.
    let accessToken = cookies().get('accessToken')?.value
    if (!accessToken || !(await isTokenValid(accessToken))) {
        const refreshToken = cookies().get('refreshToken')?.value
        if (!refreshToken) {
            redirect('/')
        }

        const newAt = await refreshAccessToken(refreshToken)
        if (!newAt) {
            redirect('/')
        }

        accessToken = newAt
    }

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

async function DashboardContent({ decoded }: { decoded: DecodedJwt }) {
    switch (decoded.role) {
        case 'participant':
            return (
                <div>
                    <Separator />
                    <TabsContent value="home" className="m-0">
                        <DashboardHome {...decoded} />
                    </TabsContent>
                    <TabsContent value="stamps" className="m-0">
                        <DashboardStamps {...decoded} />
                    </TabsContent>
                </div>
            )
        case 'club_representative':
            const org = await prisma.user.findUnique({
                where: { userId: decoded.userId },
                select: {
                    organization: {
                        select: {
                            booths: true
                        }
                    }
                }
            })

            const boothId = org!.organization?.booths[0]!.boothId!
            const websiteRoot = process.env.URL!

            return (
                <div>
                    <Separator />
                    <TabsContent value="home" className="m-0">
                        <DashboardHome {...decoded} />
                    </TabsContent>
                    <TabsContent value="booths" className="m-0">
                        <DashboardBooths boothId={boothId} />
                    </TabsContent>
                    {/* <TabsContent value="stamps" className="m-0">
                        <DashboardStamps {...decoded} />
                    </TabsContent> */}
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

    switch (role) {
        case 'participant':
            return (
                <div className="p-8">
                    <h1 className="text-4xl font-extrabold">Welcome to CSSU Orientation!</h1>
                    <br />
                    <p className="text-xl font-medium">
                        {remainingBooths == 0
                            ? 'Congratulations! You have collected all stamps.'
                            : `You have visited ${nBoothsVisited} booth${
                                  nBoothsVisited === 1 ? '' : 's'
                              }. You can still visit ${remainingBooths} booths!`}
                    </p>
                    <br />
                    <h2 className="text-3xl font-semibold">How it Works:</h2>
                    <p className="text-lg">
                        Visit each club booths and scan the QR code within 10 seconds to get a
                        stamp.
                    </p>
                </div>
            )
        case 'club_representative':
            return (
                <div className="p-8">
                    <h1 className="text-4xl font-extrabold">Welcome to CSSU Orientation!</h1>
                    <br />
                    <p className="text-xl font-medium">
                        To open the QR code for your booth, click on the booths tab.
                    </p>
                </div>
            )
        case 'admin':
            return (
                <div className="p-8">
                    <h1 className="text-4xl font-extrabold">
                        Welcome to CSSU Orientation, Mr. Admin 😎!
                    </h1>
                    <br />
                    <p className="text-xl font-medium">
                        As an admin, you have access to all the features of the dashboard.
                    </p>
                </div>
            )
    }
}

async function DashboardStamps({ userId }: DecodedJwt) {
    const stamps = await prisma.stamp.findMany({
        where: { userId },
        include: {
            booth: {
                select: {
                    organization: {
                        select: { logo: true, name: true }
                    }
                }
            }
        }
    })

    return (
        <div className="p-8">
            <h1 className="text-4xl font-extrabold">Your Stamps</h1>
            <br />
            <div className="grid grid-cols-2 gap-4">
                {stamps.length == 0 ? (
                    <p className="text-lg font-medium">
                        You have not collected any stamps yet. Go visit some booths!
                    </p>
                ) : (
                    stamps.map((stamp) => (
                        <div key={stamp.stampId} className="flex flex-col items-center">
                            {stamp.booth.organization.logo && (
                                <Image
                                    src={`/logos/${stamp.booth.organization.logo}`}
                                    alt={`${stamp.booth.organization.name} Stamp`}
                                    width={200}
                                    height={200}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

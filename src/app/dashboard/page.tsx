import { TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Tabs, TabsContent } from '@radix-ui/react-tabs'

import DashboardNav from '@/components/DashboardNav'

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
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
                className="tabs grow items-strech flex-row justify-between h-full p-4"
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
        case 'admin':
            return (
                <div>
                    <Separator />
                    <TabsContent value="home" className="m-0">
                        <DashboardHome {...decoded} />
                    </TabsContent>
                    <TabsContent value="stats" className="m-0">
                        <DashboardStats />
                    </TabsContent>
                    <TabsContent value="teststamp" className="m-0">
                        <DashboardBooths boothId="NA" />
                    </TabsContent>
                </div>
            )
        default:
            return null
    }
}

async function DashboardHome({ userId, email, role }: DecodedJwt) {
    const [nBoothsVisited, totalBooths] = await prisma.$transaction([
        prisma.stamp.count({
            where: { userId }
        }),
        prisma.booth.count({
            where: { NOT: { boothId: 'NA' } }
        })
    ])
    const remainingBooths = totalBooths - nBoothsVisited

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

    const [nBoothsVisited, totalBooths] = await prisma.$transaction([
        prisma.stamp.count({
            where: { userId }
        }),
        prisma.booth.count({
            where: { NOT: { boothId: 'NA' } }
        })
    ])

    return (
        <div className="p-8">
            <h1 className="text-4xl font-extrabold">
                Your Stamps (visited {nBoothsVisited}/{totalBooths})
            </h1>
            <br />
            <div className="grid gap-4">
                {stamps.length == 0 ? (
                    <p className="text-lg font-medium">
                        You have not collected any stamps yet. Go visit some booths!
                    </p>
                ) : (
                    stamps.map((stamp) => (
                        <div
                            key={stamp.stampId}
                            style={{
                                border: '2px solid lightgrey',
                                width: 'fit-content',
                                borderRadius: 20,
                                backgroundColor: 'white'
                            }}
                        >
                            <div key={stamp.stampId} className="flex" style={{ marginLeft: 16 }}>
                                {stamp.booth.organization.logo && (
                                    <>
                                        <Image
                                            src={`/logos/${stamp.booth.organization.logo}`}
                                            alt={`${stamp.booth.organization.name} Stamp`}
                                            style={{ marginTop: 0, marginRight: 20 }}
                                            width={100}
                                            height={100}
                                            className="align-middle"
                                        />
                                        <p
                                            style={{
                                                fontSize: 30,
                                                marginLeft: 20,
                                                marginRight: 40
                                            }}
                                            className="m-auto"
                                        >
                                            <b>
                                                <i>{stamp.booth.organization.name}</i>
                                            </b>
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

async function DashboardStats() {
    // There are no cookie checks here, but this is safe:
    // Dashboard is a server component, and the cookie checks are done in the parent component.
    // Cookies can't be altered at this point. The server correctly identifies the admin.
    const [numParticipants, numBooths, mostCollected, mostVisitedBooth] = await prisma.$transaction(
        [
            prisma.user.count({
                where: { role: 'participant' }
            }),
            prisma.booth.count({
                where: { NOT: { boothId: 'NA' } }
            }),
            // Find the participant with the most # of stamps, excluding the test stamp
            prisma.user.findFirst({
                where: { role: 'participant' },
                select: {
                    userId: true,
                    email: true,
                    stamps: {
                        select: {
                            boothId: true
                        }
                    }
                },
                orderBy: {
                    stamps: {
                        _count: 'desc'
                    }
                }
            }),
            // Find the booth with the most # of stamps collected, excluding the test stamp
            prisma.booth.findFirst({
                where: { NOT: { boothId: 'NA' } },
                select: {
                    boothId: true,
                    organization: {
                        select: {
                            name: true
                        }
                    },
                    stamps: {
                        select: {
                            userId: true
                        }
                    }
                },
                orderBy: {
                    stamps: {
                        _count: 'desc'
                    }
                }
            })
        ]
    )

    async function getRandomFinishedParticipant(): Promise<string | null> {
        // TODO: This is a naive implementation. It can be optimized.
        // TODO: Use transactions
        const participants = await prisma.user.findMany({
            where: {
                role: 'participant',
                stamps: {
                    every: {
                        boothId: { not: 'NA' }
                    }
                }
            },
            select: {
                email: true,
                stamps: {
                    select: {
                        boothId: true
                    }
                }
            }
        })

        const eligibleParticipants = participants.filter(
            (participant) => participant.stamps.length === numBooths
        )

        if (eligibleParticipants.length > 0) {
            const randomParticipant =
                eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)]
            return randomParticipant.email
        }

        return null
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-extrabold">Stats</h1>
            <br />
            <h2 className="text-3xl font-semibold">General Stats:</h2>
            <p className="text-lg font-medium">
                Total number of participants: <b>{numParticipants}</b>
            </p>
            <p className="text-lg font-medium">
                Total number of booths: <b>{numBooths}</b>
            </p>
            <br />
            <h2 className="text-3xl font-semibold">Most Collected Stamp:</h2>
            <p className="text-lg font-medium">
                {mostCollected
                    ? `The participant with the most stamps is ${mostCollected.email} with ${mostCollected.stamps.length} stamps.`
                    : 'No participants have collected any stamps yet.'}
            </p>
            <br />
            <h2 className="text-3xl font-semibold">Most Visited Booth:</h2>
            <p className="text-lg font-medium">
                {mostVisitedBooth
                    ? `The most visited booth is ${mostVisitedBooth.organization.name} with ${mostVisitedBooth.stamps.length} stamps collected.`
                    : 'No booths have been visited yet.'}
            </p>
            <br />
            <h2 className="text-3xl font-semibold">Random Finished Participant:</h2>
            <p className="text-lg font-medium">
                {numParticipants > 0
                    ? `A random participant who visited all booths is ${
                          (await getRandomFinishedParticipant()) || 'not available yet'
                      }.`
                    : 'No participants have visited any booths yet.'}
            </p>
        </div>
    )
}

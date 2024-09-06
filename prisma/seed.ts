// Keep the require!! Don't change it with import.
const { PrismaClient, UserRole } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// The entire file can be optimized by using insertMany, but I'm not bothering with that
// just for 10 clubs and a few admins!
const seedingPrisma = new PrismaClient()

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../seed.json'), 'utf-8'))

async function main() {
    for (const adminEmail of data.admins) {
        const existingAdmin = await seedingPrisma.user.findUnique({ where: { email: adminEmail } })

        if (!existingAdmin) {
            await seedingPrisma.user.create({
                data: {
                    email: adminEmail,
                    role: UserRole.admin
                }
            })
        }

        if (!adminEmail.endsWith('@mail.utoronto.ca')) {
            const existingExemption = await seedingPrisma.exemptedEmail.findUnique({
                where: { email: adminEmail }
            })
            if (!existingExemption) {
                await seedingPrisma.exemptedEmail.create({
                    data: {
                        email: adminEmail,
                        reason: 'Admin'
                    }
                })
            }
        }
    }

    for (const clubData of data.clubs) {
        const { email, club, booth } = clubData

        const existingClubRep = await seedingPrisma.user.findUnique({ where: { email } })

        if (!existingClubRep) {
            let organization = await seedingPrisma.organization.findFirst({
                where: { name: club }
            })

            if (!organization) {
                organization = await seedingPrisma.organization.create({
                    data: {
                        name: club
                    }
                })
            }

            await seedingPrisma.user.create({
                data: {
                    email,
                    role: UserRole.club_representative,
                    organizationId: organization.organizationId
                }
            })

            const existingBooth = await seedingPrisma.booth.findUnique({
                where: { boothId: booth }
            })

            if (!existingBooth) {
                await seedingPrisma.booth.create({
                    data: {
                        boothId: booth,
                        organizationId: organization.organizationId,
                        description: `Booth for ${club}`
                    }
                })
            }

            if (!email.endsWith('@mail.utoronto.ca')) {
                const existingExemption = await seedingPrisma.exemptedEmail.findUnique({
                    where: { email }
                })

                if (!existingExemption) {
                    await seedingPrisma.exemptedEmail.create({
                        data: {
                            email,
                            reason: `Club Representative: ${club}`
                        }
                    })
                }
            }
        }
    }

    console.log('Database seeded successfully')
}

main()
    .then(async () => {
        await seedingPrisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await seedingPrisma.$disconnect()
        process.exit(1)
    })

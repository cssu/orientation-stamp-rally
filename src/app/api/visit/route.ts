import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import redis from '@/lib/redis'
import jwt from 'jsonwebtoken'

const QR_SCAN_PERIOD = 15000

type DecodedJwt = {
    userId: string
    email: string
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const payload = searchParams.get('qr')
    const boothId = searchParams.get('boothId')

    if (!payload) {
        return NextResponse.json({ valid: false, message: 'Missing payload' })
    }

    if (!boothId) {
        return NextResponse.json({ valid: false, message: 'Missing boothId' })
    }

    const redisData = await redis.ephemeral.get(`qr:${payload}`)

    if (!redisData) {
        return NextResponse.json({ valid: false, message: 'QR code not found' })
    }

    const { actualPayloadEncoded, timestamp } = JSON.parse(redisData)

    const actualPayload = decodeURIComponent(actualPayloadEncoded)

    if (actualPayload != payload) {
        return NextResponse.json({ valid: false, message: 'Invalid QR code' })
    }

    const currentTime = new Date().getTime()
    const qrGenerationTime = new Date(timestamp).getTime()

    if (currentTime - qrGenerationTime > QR_SCAN_PERIOD) {
        return NextResponse.json({ valid: false, message: 'QR code expired' })
    }

    const accessToken = req.cookies.get('accessToken')?.value
    if (!accessToken) {
        return NextResponse.json({ valid: false, message: 'No access token found. Log in again.' })
    }

    const decoded = jwt.decode(accessToken) as DecodedJwt

    await prisma.stamp.create({
        data: {
            user: {
                connect: { userId: decoded.userId }
            },
            booth: {
                connect: { boothId: boothId }
            }
        }
    })

    return NextResponse.redirect(process.env.URL + '/dashboard')
}

// export async function GET(req: NextRequest) {
//   if (!req.url) {
//     return new Response(
//       JSON.stringify({ message: "No request URL inputted 🤔" }),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
//   const { searchParams } = new URL(req.url);
//   const qr = searchParams.get("qr");
//   if (!qr) {
//     return new Response(JSON.stringify({ message: "No QR code entered 🤔" }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
//   const isQRValid = await validateQR(qr);

//   return new Response(JSON.stringify({ valid: isQRValid }), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

// async function validateQR(qr: string) {
//   console.log(`QR: ${qr}`);
//   const [timestamp, _boothID, signature] = qr.split("-");
//   const boothID = _boothID.replace(" ", "+");
//   if (Date.now() - Number(timestamp) > QR_SCAN_PERIOD) {
//     return false;
//   }
//   const isValidHMAC = await verifyHMAC(
//     `${timestamp}-${boothID}`,
//     `12272005`,
//     `${signature}`
//   );
//   return isValidHMAC;
// }

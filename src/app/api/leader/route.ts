import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'
import redis from '@/lib/redis'

export async function POST(req: NextRequest) {
    const payload = crypto.randomUUID()
    const timestamp = new Date().toISOString()

    const accessToken = req.cookies.get('accessToken')?.value
    if (!accessToken) {
        return NextResponse.json({ message: 'No access token found. Log in again.' })
    }

    const decoded = jwt.decode(accessToken) as { userId: string }

    const boothId = await prisma.user
        .findUnique({
            where: { userId: decoded.userId },
            select: {
                organization: {
                    select: {
                        booths: {
                            select: {
                                boothId: true
                            }
                        }
                    }
                }
            }
        })
        .then((org) => org!.organization!.booths[0]!.boothId)

    const qrData = {
        payload,
        timestamp,
    }

    await redis.ephemeral.set(`qr:${boothId}`, JSON.stringify(qrData), 'EX', 10)

    const qr = `${process.env.URL}/api/visit?qr=${encodeURIComponent(payload)}&boothId=${boothId}`

    return NextResponse.json({ qr })
}
// import { calculateHMAC } from "@/lib/utils";

// /*
// Each boothID maps to the last booth refresh and the last QR
// For example, if boothInfo[5] = {lastRefresh: 4206942069, qr: "dfuysfadiuty"}
// then that means that booth 5 last refreshed at the at time and had that QR
// code during the last refresh
// */
// interface boothDetails {
//   lastRefresh: number;
//   qr: string;
// }
// let boothInfo: { [boothID: string]: boothDetails } = {};

// const REFRESH_TIME = 15000;

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url || "");
//   const boothID: string = searchParams.get("boothid") || "";
//   const curTime = Date.now();

//   if (!boothID) {
//     return new Response(JSON.stringify(boothInfo[boothID]), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }

//   if (
//     !boothInfo[boothID] ||
//     curTime - boothInfo[boothID].lastRefresh > REFRESH_TIME
//   ) {
//     genNewQR(boothID, curTime).then(
//       (newQR) => (boothInfo[boothID] = { lastRefresh: curTime, qr: newQR })
//     );
//   }

//   return new Response(JSON.stringify(boothInfo[boothID]), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

// async function genNewQR(boothID: string, curTime: number): Promise<string> {
//   const payload = `${curTime}-${boothID}`;
//   const signature = await calculateHMAC(payload, "12272005");
//   const qr = `${payload}-${signature}`;
//   return qr;
// }

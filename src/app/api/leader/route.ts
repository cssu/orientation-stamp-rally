import { NextApiRequest } from 'next'
import { calculateHMAC } from '@/lib/utils'

/*
Each boothID maps to the last booth refresh and the last QR
For example, if boothInfo[5] = {lastRefresh: 4206942069, qr: "dfuysfadiuty"}
then that means that booth 5 last refreshed at the at time and had that QR
code during the last refresh
*/
interface boothDetails {
    lastRefresh: number
    qr: string
}
let boothInfo: { [boothID: number]: boothDetails } = {}

const REFRESH_TIME = 15000

export async function GET(req: NextApiRequest) {
    const { searchParams } = new URL(req.url)
    console.log(req.url)
    const boothID = searchParams.get('boothid')
    const curTime = Date.now()

    if (!boothInfo[boothID] || curTime - boothInfo[boothID].lastRefresh > REFRESH_TIME) {
        genNewQR(boothID, curTime).then(
            (newQR) => (boothInfo[boothID] = { lastRefresh: curTime, qr: newQR })
        )
    }

    console.log(boothInfo)

    return new Response(JSON.stringify(boothInfo[boothID]), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function genNewQR(boothID: number, curTime: number): Promise<string> {
    const payload = `${curTime}-${boothID}`
    const signature = await calculateHMAC(payload, '12272005')
    const qr = `${payload}-${signature}`
    return qr
}

import { NextApiRequest } from 'next'
import { verifyHMAC } from '@/lib/utils'

const QR_SCAN_PERIOD = 15000

export async function GET(req: NextApiRequest) {
    const { searchParams } = new URL(req.url)
    const qr = searchParams.get('qr')
    const isQRValid = await validateQR(qr)

    return new Response(JSON.stringify({ valid: isQRValid }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

async function validateQR(qr) {
    console.log(`QR: ${qr}`)
    const [timestamp, _boothID, signature] = qr.split('-')
    const boothID = _boothID.replace(' ', '+')
    if (Date.now() - Number(timestamp) > QR_SCAN_PERIOD) {
        return false
    }
    const isValidHMAC = await verifyHMAC(`${timestamp}-${boothID}`, `12272005`, `${signature}`)
    return isValidHMAC
}

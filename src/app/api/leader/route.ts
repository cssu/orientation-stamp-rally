import type { NextApiRequest } from 'next'

export async function GET(req: NextApiRequest) {
    return Response.json({ message: 'ack' })
}

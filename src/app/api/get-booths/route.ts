import { NextApiRequest } from 'next'

const fs = require('fs')
const file = require('@/data/booths.json')

export function GET(req: NextApiRequest) {
    return new Response(JSON.stringify(file), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

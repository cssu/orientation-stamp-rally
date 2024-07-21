import { NextApiRequest } from 'next'

const fs = require('fs')
const file = require('@/data/booths_attended.json')

export function GET(req: NextApiRequest) {
    const { searchParams } = new URL(req.url)
    const boothID = searchParams.get('boothid').replace(' ', '-')
    const curBoothsAttended = file
    const alreadyDone = curBoothsAttended.includes(boothID)

    if (!alreadyDone) {
        let out
        if (boothID == 'clear-all') {
            out = JSON.stringify([])
        } else {
            out = JSON.stringify([...curBoothsAttended, boothID])
        }
        fs.writeFile('src/data/booths_attended.json', out, function writeJSON(err) {
            if (err) return console.log(err)
        })
    }

    return new Response(JSON.stringify({ alreadyDone: alreadyDone }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

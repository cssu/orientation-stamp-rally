import { NextRequest, NextResponse } from 'next/server'

const fs = require('fs')
const file = require('@/data/booths_attended.json')

export function GET(req: NextRequest) {
    return NextResponse.json(file)
}

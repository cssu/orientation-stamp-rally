import { NextResponse, type NextRequest } from "next/server";

export async function GET(_: NextRequest) {
    return NextResponse.json("OK")
}
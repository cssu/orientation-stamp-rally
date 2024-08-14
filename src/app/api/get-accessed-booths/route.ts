import { NextRequest } from "next/server";

import fs from 'fs'
import file from '@/data/booths_attended.json'

export function GET(req: NextRequest) {
  return new Response(JSON.stringify(file), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

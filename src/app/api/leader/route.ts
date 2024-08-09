import { NextRequest } from "next/server";
import { calculateHMAC } from "@/lib/utils";

/*
Each boothID maps to the last booth refresh and the last QR
For example, if boothInfo[5] = {lastRefresh: 4206942069, qr: "dfuysfadiuty"}
then that means that booth 5 last refreshed at the at time and had that QR
code during the last refresh
*/
interface boothDetails {
  lastRefresh: number;
  qr: string;
}
let boothInfo: { [boothID: string]: boothDetails } = {};

const REFRESH_TIME = 15000;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url || "");
  const boothID: string = searchParams.get("boothid") || "";
  const curTime = Date.now();

  if (!boothID) {
    return new Response(JSON.stringify(boothInfo[boothID]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (
    !boothInfo[boothID] ||
    curTime - boothInfo[boothID].lastRefresh > REFRESH_TIME
  ) {
    genNewQR(boothID, curTime).then(
      (newQR) => (boothInfo[boothID] = { lastRefresh: curTime, qr: newQR })
    );
  }

  return new Response(JSON.stringify(boothInfo[boothID]), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function genNewQR(boothID: string, curTime: number): Promise<string> {
  const payload = `${curTime}-${boothID}`;
  const signature = await calculateHMAC(payload, "12272005");
  const qr = `${payload}-${signature}`;
  return qr;
}

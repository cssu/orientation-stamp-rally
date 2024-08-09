import { NextRequest } from "next/server";
import { verifyHMAC } from "@/lib/utils";

const QR_SCAN_PERIOD = 15000;

export async function GET(req: NextRequest) {
  if (!req.url) {
    return new Response(
      JSON.stringify({ message: "No request URL inputted 🤔" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const { searchParams } = new URL(req.url);
  const qr = searchParams.get("qr");
  if (!qr) {
    return new Response(JSON.stringify({ message: "No QR code entered 🤔" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const isQRValid = await validateQR(qr);

  return new Response(JSON.stringify({ valid: isQRValid }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function validateQR(qr: string) {
  console.log(`QR: ${qr}`);
  const [timestamp, _boothID, signature] = qr.split("-");
  const boothID = _boothID.replace(" ", "+");
  if (Date.now() - Number(timestamp) > QR_SCAN_PERIOD) {
    return false;
  }
  const isValidHMAC = await verifyHMAC(
    `${timestamp}-${boothID}`,
    `12272005`,
    `${signature}`
  );
  return isValidHMAC;
}

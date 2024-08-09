/*

*/

import { NextRequest } from "next/server";

const fs = require("fs");
const file = require("@/data/booths_attended.json");

export function GET(req: NextRequest) {
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
  const boothID = (searchParams.get("boothid") || "").replace(" ", "-");
  const curBoothsAttended = file;
  const alreadyDone = curBoothsAttended.includes(boothID);

  if (!alreadyDone) {
    let out: string;
    if (boothID == "clear-all") {
      out = JSON.stringify([]);
    } else {
      out = JSON.stringify([...curBoothsAttended, boothID]);
    }
    fs.writeFile(
      "src/data/booths_attended.json",
      out,
      (err: NodeJS.ErrnoException | null) => {
        if (err) return console.log(err);
      }
    );
  }

  return new Response(JSON.stringify({ alreadyDone: alreadyDone }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

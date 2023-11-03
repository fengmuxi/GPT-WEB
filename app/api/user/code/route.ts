import { NextRequest } from "next/server";
import { getIP } from "../../auth";
import { AdminPath } from "@/app/constant";
import { getAdminUrl } from "../../common";

export async function POST(req: NextRequest) {
  try {
    let res = await fetch(getAdminUrl() + AdminPath.code, {
      method: "GET",
      headers: {
        UserIp: String(getIP(req)),
      },
    });
    let msg = await res.json();
    // console.log(msg)
    return new Response(JSON.stringify(msg));
  } catch (e) {
    console.error("[eladmin] ", e);
    return new Response(JSON.stringify(e));
  }
}

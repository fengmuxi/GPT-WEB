import { NextRequest } from "next/server";
import { getIP } from "../../auth";
import { AdminPath } from "@/app/constant";
import { getAdminUrl } from "../../common";

export async function POST(req: NextRequest) {
  try {
    const mail = req.nextUrl.searchParams.get("mail");
    const code = req.nextUrl.searchParams.get("code");
    let res = await fetch(
      getAdminUrl() + AdminPath.findpwd + "?mail=" + mail + "&code=" + code,
      {
        method: "POST",
        headers: {
          UserIp: String(getIP(req)),
        },
      },
    );
    let msg = await res.json();
    // console.log(msg)
    return new Response(JSON.stringify(msg));
  } catch (e) {
    console.error("[eladmin] ", e);
    return new Response(JSON.stringify(e));
  }
}

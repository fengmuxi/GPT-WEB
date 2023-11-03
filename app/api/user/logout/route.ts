import { NextRequest, NextResponse } from "next/server";
import { auth, getIP } from "../../auth";
import { AdminPath } from "@/app/constant";
import { getAdminUrl } from "../../common";

export async function POST(req: NextRequest) {
  try {
    const authResult = auth(req);
    if (authResult.error) {
      return NextResponse.json(authResult, {
        status: 401,
      });
    }
    const token = req.headers.get("auth") ?? "";
    let res = await fetch(getAdminUrl() + AdminPath.logout, {
      method: "DELETE",
      headers: {
        Authorization: token,
        UserIp: String(getIP(req)),
      },
    });
    if (res.status == 401) {
      let msg = {
        flag: false,
        msg: "未登录！",
      };
      // console.log(res.status)
      return new Response(JSON.stringify(msg));
    }
    let msg = await res.json();
    console.log(msg);
    return new Response(JSON.stringify(msg));
  } catch (e) {
    console.error("[eladmin] ", e);
    return new Response(JSON.stringify(e));
  }
}

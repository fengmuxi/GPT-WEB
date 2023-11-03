import { NextRequest } from "next/server";
import { getIP } from "../../auth";
import { AdminPath } from "@/app/constant";
import { getAdminUrl } from "../../common";

export async function POST(req: NextRequest) {
  try {
    // console.log(req.body)
    // const user=req.nextUrl.searchParams.get("user")
    // const password=req.nextUrl.searchParams.get("password")
    // const code=req.nextUrl.searchParams.get("code")
    // const uuid=req.nextUrl.searchParams.get("uuid")
    // let body={
    //   "username": user,
    //   "password": password,
    //   "code": code,
    //   "uuid": uuid
    // }
    // console.log(await req.json())
    let res = await fetch(getAdminUrl() + AdminPath.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        UserIp: String(getIP(req)),
      },
      body: JSON.stringify(await req.json()),
    });
    let msg = await res.json();
    // console.log(msg)
    return new Response(JSON.stringify(msg));
  } catch (e) {
    console.error("[eladmin] ", e);
    return new Response(JSON.stringify(e));
  }
}

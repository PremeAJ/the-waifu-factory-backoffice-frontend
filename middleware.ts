import { NextRequest, NextResponse } from "next/server";
import { ssrRefreshSession } from "./src/app/context/AuthContext/action";

export async function middleware(req: NextRequest) {
  // เรียก refresh session จาก action.ts
  await ssrRefreshSession();

  return NextResponse.next();
}

// กำหนด matcher ให้ middleware ทำงานกับทุก path (ยกเว้น static/_next/api)
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
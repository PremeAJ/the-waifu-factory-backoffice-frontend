import { NextRequest, NextResponse } from "next/server";
import { supabaseRefreshSession } from "./src/utils/supabase/server";

export async function middleware(req: NextRequest) {
  // เรียก refresh session จาก action.ts
  await supabaseRefreshSession();

  return NextResponse.next();
}

// กำหนด matcher ให้ middleware ทำงานกับทุก path (ยกเว้น static/_next/api)
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
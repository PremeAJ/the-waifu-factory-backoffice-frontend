import { createClient } from "@/common/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { CookieKey } from "@/common/constants/cookie-key";
async function handleRequest(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const cookieStore = await cookies();
  cookieStore.set({
   name: 'name',
   value: 'lee',
  //  httpOnly: true,
  //  path: '/',
 })
  console.log("🚀 ~ handleRequest ~ cookieStore:", cookieStore.get('name'))
  // console.log("🚀 ~ handleRequest ~ cookieStore.get(CookieKey.DeviceId):", cookieStore.get(CookieKey.DeviceId)?.name)
  // const cookieDeviceId = cookieStore.get(CookieKey.DeviceId)?.value || uuidv4();
  // console.log("🚀 ~ handleRequest ~ cookieDeviceId:", cookieDeviceId)

  const { path } = await context.params;
  const search = req.nextUrl.search;
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path.join("/")}${search}`;
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token || "";

  try {
    const options: RequestInit = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Origin: process.env.NEXT_PUBLIC_DOMAIN || "",
      },
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
    };

    const response = await fetch(backendUrl, options);
    console.log("🚀 ~ handleRequest ~ response:", response);
    const responseData = await response.json();
    return NextResponse.json(responseData, { status: response.status });
  } catch (error: any) {
    // console.error(`[API][500][${req.method}] ${req.url} - ${error.message}`);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Export handler สำหรับแต่ละ HTTP method
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const OPTIONS = handleRequest;
export const HEAD = handleRequest;

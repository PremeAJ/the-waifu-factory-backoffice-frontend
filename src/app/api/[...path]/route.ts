import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function handleRequest(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params; // ต้อง await ก่อนใช้งาน
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path.join("/")}`;

  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token || "";

  try {
    const options: RequestInit = {
      method: req.method, // ใช้ method จาก request
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Origin: process.env.NEXT_PUBLIC_DOMAIN || "",
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text() // อ่าน body เฉพาะ method ที่ไม่ใช่ GET หรือ HEAD
          : undefined,
    };

    const response = await fetch(backendUrl, options);
    const responseData = await response.json();

    if (response.ok) {
      console.log(`[API][${response.status}][${req.method}] ${backendUrl}`);
    } else {
      console.error(`[API][${response.status}][${req.method}] ${backendUrl}`);
    }

    return NextResponse.json(responseData, { status: response.status });
  } catch (error: any) {
    console.error(`[API][500][${req.method}] ${req.url} - ${error.message}`);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
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

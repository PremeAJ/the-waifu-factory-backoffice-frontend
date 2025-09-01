import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handleRequest(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const search = req.nextUrl.search;
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path.join("/")}${search}`;

  // ใช้ cookies(req) เพื่ออ่าน cookie จาก request ปัจจุบัน
 const allCookies = req.cookies.getAll(); 
 console.log("🚀 ~ handleRequest ~ allCookies:", allCookies)

  try {
    const options: RequestInit = {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
    };
    const response = await fetch(backendUrl, options);
    const responseData = await response.json();
    return NextResponse.json(responseData, { status: response.status });
  } catch (error: any) {
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

import authOptions from "@/common/auth/options";
import { HeadersKey } from "@/common/constants/header";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function handleRequest(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const session = await getServerSession(authOptions);
  const { path } = await context.params;
  const search = req.nextUrl.search;
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${path.join("/")}${search}`.replace("/authentication", "/auth");
  if (session?.accessToken) req.headers.set(HeadersKey.Authorization, `Bearer ${session.accessToken}`);
  try {
    const options: RequestInit = {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.arrayBuffer() : undefined,
    };
    const response = await fetch(backendUrl, options);
    let responseData: any;
    try {
      responseData = await response.json();
    } catch {
      responseData = { statusCode: response.status, message: response.statusText };
    }
    if (response?.status >= 400) {
      console.log("API ERROR : ", responseData?.message);
    }
    return NextResponse.json(responseData, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const OPTIONS = handleRequest;
export const HEAD = handleRequest;

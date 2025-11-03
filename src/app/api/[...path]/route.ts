import authOptions from "@/common/auth/options";
import { HeadersKey } from "@/common/constants/header";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type ProxyResult = { data: any; status: number };

let refreshingPromise: Promise<ProxyResult> | null = null;

async function proxyFetch(backendUrl: string, req: NextRequest): Promise<ProxyResult> {
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
  if (response.status >= 400) {
    console.log("API ERROR : ", responseData?.message);
  }
  return { data: responseData, status: response.status };
}

async function handleRequest(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const session = await getServerSession(authOptions);
  const { path } = await context.params;
  const joined = path.join("/");
  const search = req.nextUrl.search;
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${joined}${search}`.replace("/authentication", "/auth");

  if (session?.accessToken) req.headers.set(HeadersKey.Authorization, `Bearer ${session.accessToken}`);
  req.headers.set(HeadersKey.Origin, process.env.NEXTAUTH_URL || "");

  const isRefresh = joined.includes("session/refresh");

  try {
    if (isRefresh) {
      if (!refreshingPromise) {
        refreshingPromise = proxyFetch(backendUrl, req);
      }
      const { data, status } = await refreshingPromise;
      return NextResponse.json(data, { status });
    }

    // ถ้า refresh กำลังทำงาน ให้รอให้เสร็จก่อน
    if (refreshingPromise) {
      try {
        await refreshingPromise;
      } catch {
        // ignore
      }
    }

    const { data, status } = await proxyFetch(backendUrl, req);
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    if (isRefresh) {
      refreshingPromise = null;
    }
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const OPTIONS = handleRequest;
export const HEAD = handleRequest;

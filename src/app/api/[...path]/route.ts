import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params; // ต้อง await ก่อนใช้งาน
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path.join("/")}`;

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
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined,
    };

    const response = await fetch(backendUrl, options);
    const data = await response.json();

    if (response.ok) {
      console.log(
        `[32m[API][${response.status}][${req.method}] ${backendUrl}`
      );
    } else {
      console.error(
        `[31m[API][${response.status}][${req.method}] ${backendUrl}`
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(
      `[31m[API][500][${req.method}] ${req.url} - ${error.message}`
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

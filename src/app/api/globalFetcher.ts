import { Method } from "@/common/constants/method";
import { getHeaders } from "@/common/utils/getHeaders";
import { signOut } from "next-auth/react";

async function handleResponse(res: Response, method: string, url: string) {
  const data = await res.json();
  if (typeof window !== "undefined" && data?.statusCode === 401) {
    signOut();
  }
  return data;
}

const baseFetcher = async (
  method: string,
  url: string | [string, Record<string, any>],
  body?: any,
  headers?: Record<string, string>
) => {
  let fullUrl = "";
  let params: Record<string, any> | undefined;

  if (Array.isArray(url)) {
    fullUrl = url[0];
    params = url[1];
  } else {
    fullUrl = url;
  }

  if (method === Method.GET && params && Object.keys(params).length > 0) {
    const search = new URLSearchParams(params).toString();
    fullUrl += (fullUrl.includes("?") ? "&" : "?") + search;
  }

  if (typeof fullUrl === "string" && fullUrl.startsWith("/")) {
    if (typeof window !== "undefined") {
      fullUrl = window.location.origin + fullUrl;
    } else {
      fullUrl =
        (process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_DOMAIN || `http://localhost:${process.env.PORT}`) +
        fullUrl;
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers: method === Method.GET
      ? { browserrefreshed: "false", ...getHeaders(headers) }
      : getHeaders(headers),
    ...(body && method !== Method.GET ? { body: JSON.stringify(body) } : {}),
  };

  return fetch(fullUrl, fetchOptions).then((res) => handleResponse(res, method, fullUrl));
};

// สร้าง method เฉพาะแต่ละแบบ
const getFetcher = (url: string | [string, Record<string, any>], headers?: Record<string, string>) =>
  baseFetcher(Method.GET, url, undefined, headers);

const postFetcher = (url: string, body: any, headers?: Record<string, string>) =>
  baseFetcher(Method.POST, url, body, headers);

const putFetcher = (url: string, body: any, headers?: Record<string, string>) =>
  baseFetcher(Method.PUT, url, body, headers);

const patchFetcher = (url: string, body: any, headers?: Record<string, string>) =>
  baseFetcher(Method.PATCH, url, body, headers);

const deleteFetcher = (url: string, body: any, headers?: Record<string, string>) =>
  baseFetcher(Method.DELETE, url, body, headers);

export { getFetcher, postFetcher, putFetcher, deleteFetcher, patchFetcher };

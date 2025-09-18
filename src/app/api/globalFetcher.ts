import { Method } from "@/common/constants/method";
import { getHeaders } from "@/common/utils/getHeaders";
import { getSession, signOut } from "next-auth/react";

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function handleResponse(
  res: Response,
  method: string,
  url: string | [string, Record<string, any>],
  body?: any,
  headers?: Record<string, string>
): Promise<any> {
  if (res.status !== 401) {
    return res.json();
  }

  if (typeof window === "undefined") {
    return res.json();
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then(() => {
        return baseFetcher(method, url, body, headers);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  isRefreshing = true;

  try {
    const session = await getSession();
    if (!session) {
      throw new Error("No session");
    }
    processQueue(null, session.accessToken);
    return baseFetcher(method, url, body, headers);
  } catch (error) {
    processQueue(error, null);
    signOut();
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}

const baseFetcher = async (
  method: string,
  url: string | [string, Record<string, any>],
  body?: any,
  headers?: Record<string, string>
): Promise<any> => {
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
    headers:
      method === Method.GET ? { browserrefreshed: "false", ...getHeaders(headers) } : getHeaders(headers),
    ...(body && method !== Method.GET ? { body: JSON.stringify(body) } : {}),
  };

  const originalRequestUrl = Array.isArray(url) ? url : fullUrl;
  return fetch(fullUrl, fetchOptions).then((res) =>
    handleResponse(res, method, originalRequestUrl, body, headers)
  );
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

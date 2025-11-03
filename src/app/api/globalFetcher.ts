import { Method } from "@/common/constants/method";
import { getHeaders } from "@/common/utils/getHeaders";
import { getSession, signOut } from "next-auth/react";

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];
let refreshPromise: Promise<void> | null = null;

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

async function ensureRefreshed() {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/v1/session/refresh", { method: "POST", credentials: "include" })
      .then(async (r) => {
        // อ่าน body เพื่อให้ connection ปิดถูกต้อง
        try { await r.json(); } catch {}
        if (!r.ok) throw new Error("Refresh failed");
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function handleResponse(
  res: Response,
  method: string,
  url: string | [string, Record<string, any>],
  body?: any,
  headers?: Record<string, string>
): Promise<any> {
  if (res.status === 204) {
    return { statusCode: 204, data: null };
  }

  const tryJson = async () => {
    try {
      return await res.json();
    } catch {
      return { statusCode: res.status, message: res.statusText };
    }
  };

  if (res.status !== 401 && res.status !== 403) {
    return tryJson();
  }

  if (typeof window === "undefined") {
    return tryJson();
  }

  if (res.status === 403) {
    await signOut();
    return Promise.reject(new Error("Forbidden"));
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
    await signOut();
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

  const computedHeaders = await getHeaders(headers);
  const isFormBody =
    (typeof FormData !== "undefined" && body instanceof FormData) ||
    (typeof Blob !== "undefined" && body instanceof Blob) ||
    body instanceof ArrayBuffer ||
    (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams);
  let finalHeaders: Record<string, string> | undefined = computedHeaders ? { ...computedHeaders } : undefined;
  if (isFormBody && finalHeaders) {
    const filtered: Record<string, string> = {};
    Object.entries(finalHeaders).forEach(([k, v]) => {
      if (k.toLowerCase() !== "content-type") filtered[k] = v;
    });
    finalHeaders = filtered;
  }

  const fetchHeaders: Record<string, string> =
    method === Method.GET ? { browserrefreshed: "false", ...(finalHeaders || {}) } : { ...(finalHeaders || {}) };

  const fetchOptions: RequestInit = {
    method,
    cache: "no-store",
    headers: fetchHeaders,
    ...(body && method !== Method.GET && method !== Method.HEAD
      ? { body: isFormBody ? (body as any) : JSON.stringify(body) }
      : {}),
  };

  const originalRequestUrl = Array.isArray(url) ? url : fullUrl;
  return fetch(fullUrl, fetchOptions).then((res) =>
    handleResponse(res, method, originalRequestUrl, body, headers)
  );
};

async function baseFetch(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, { credentials: "include", ...(init || {}) });

  // ถ้า 401 และไม่ใช่เส้น refresh ให้รอ refresh แล้ว retry 1 ครั้ง
  if (res.status === 401 && !input.toString().includes("/session/refresh")) {
    await ensureRefreshed();
    const retry = await fetch(input, { credentials: "include", ...(init || {}) });
    return retry;
  }
  return res;
}

export async function getFetcher(url: string) {
  const res = await baseFetch(url, { method: "GET" });
  return res.json();
}

export async function postFetcher(url: string, body?: any) {
  const res = await baseFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export async function putFetcher(url: string, body?: any) {
  const res = await baseFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export async function deleteFetcher(url: string, body?: any) {
  const res = await baseFetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export async function serverGetFetcher(url: string, headers?: Record<string, string>) {
  const res = await fetch(url, { method: "GET", headers, cache: "no-store", credentials: "include" });
  try { return await res.json(); } catch { return { statusCode: res.status, message: res.statusText }; }
}

export async function serverPostFetcher(url: string, body?: any, headers?: Record<string, string>) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    cache: "no-store",
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  try { return await res.json(); } catch { return { statusCode: res.status, message: res.statusText }; }
}

export async function serverPutFetcher(url: string, body?: any, headers?: Record<string, string>) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    cache: "no-store",
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  try { return await res.json(); } catch { return { statusCode: res.status, message: res.statusText }; }
}

export async function serverDeleteFetcher(url: string, body?: any, headers?: Record<string, string>) {
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    cache: "no-store",
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  try { return await res.json(); } catch { return { statusCode: res.status, message: res.statusText }; }
}
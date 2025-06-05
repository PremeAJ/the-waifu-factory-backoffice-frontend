// SWR fetcher function

async function handleResponse(res: Response, method: string, url: string) {
  if (!res.ok) {
    let errorText = "Unknown error";
    try {
      const data = await res.json();
      errorText = data?.message || JSON.stringify(data) || errorText;
    } catch {
      try {
        errorText = await res.text();
      } catch {}
    }
    console.debug(`[${method}] ${url} | API Error:`, res.status, errorText);
    throw new Error(errorText);
  }
  // log response ที่สำเร็จ
  try {
    const data = await res.clone().json();
    console.log(`[${method}] ${url} | API Success:`, res.status, data);
  } catch {
    const text = await res.clone().text();
    console.log(`[${method}] ${url} | API Success (text):`, res.status, text);
  }
  return res.json();
}

const getFetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: { browserrefreshed: "false" },
  }).then(res => handleResponse(res, "GET", url));

const postFetcher = (url: string, arg: any) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  }).then(res => handleResponse(res, "POST", url));

const putFetcher = (url: string, arg: any) =>
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  }).then(res => handleResponse(res, "PUT", url));

const patchFetcher = (url: string, arg: any) =>
  fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  }).then(res => handleResponse(res, "PATCH", url));

const deleteFetcher = (url: string, arg: any) =>
  fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  }).then(res => handleResponse(res, "DELETE", url));

export { getFetcher, postFetcher, putFetcher, deleteFetcher, patchFetcher };

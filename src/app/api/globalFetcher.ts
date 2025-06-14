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
    throw new Error(errorText);
  }
  try {
    const data = await res.clone().json();
  } catch {
    const text = await res.clone().text();
  }
  return res.json();
}

const getFetcher = (url: string | [string, Record<string, any>]) => {
  let fullUrl = "";
  let params: Record<string, any> | undefined;

  if (Array.isArray(url)) {
    fullUrl = url[0];
    params = url[1];
  } else {
    fullUrl = url;
  }

  if (params && Object.keys(params).length > 0) {
    const search = new URLSearchParams(params).toString();
    fullUrl += (fullUrl.includes("?") ? "&" : "?") + search;
  }

  return fetch(fullUrl, {
    method: "GET",
    headers: { browserrefreshed: "false" },
  }).then((res) => handleResponse(res, "GET", fullUrl));
};

const postFetcher = (url: string, arg: any) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  }).then((res) => handleResponse(res, "POST", url));

const putFetcher = (url: string, arg: any) =>
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  }).then((res) => handleResponse(res, "PUT", url));

const patchFetcher = (url: string, arg: any) =>
  fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  }).then((res) => handleResponse(res, "PATCH", url));

const deleteFetcher = (url: string, arg: any) =>
  fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  }).then((res) => handleResponse(res, "DELETE", url));

export { getFetcher, postFetcher, putFetcher, deleteFetcher, patchFetcher };

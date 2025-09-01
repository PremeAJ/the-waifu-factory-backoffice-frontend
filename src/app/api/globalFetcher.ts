import { HeadersKey } from "@/common/constants/header";
import { Method } from "@/common/constants/method";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

async function handleResponse(res: Response, method: string, url: string) {
  return res.json();
}

const getHeaders = async (headers?: Record<string, string>) => {
  const deviceId = Cookies.get(HeadersKey.DeviceId) || uuidv4();
  const lang = Cookies.get(HeadersKey.Lang) || "";
  Cookies.set('test', 'asd');
  const header = {
    [HeadersKey.Lang]: lang,
    [HeadersKey.ContentType]: "application/json",
    [HeadersKey.Origin]: process.env.NEXT_PUBLIC_DOMAIN || "",
    [HeadersKey.DeviceId]: deviceId,
    ...(headers || {}),
  };
  console.log("🚀 ~ getHeaders ~ header:", header)
  return header;
};

const getFetcher = async (url: string | [string, Record<string, any>], headers?: Record<string, string>) => {
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
    method: Method.GET,
    headers: { browserrefreshed: "false", ...(await getHeaders(headers)) },
  }).then((res) => handleResponse(res, Method.GET, fullUrl));
};

const postFetcher = async (url: string, body: any, headers?: Record<string, string>) => {
  return fetch(url, {
    method: Method.POST,
    headers: await getHeaders(headers),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(res, Method.POST, url));
};

const putFetcher = async (url: string, body: any, headers?: Record<string, string>) =>
  fetch(url, {
    method: Method.PUT,
    headers: await getHeaders(headers),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(res, Method.PUT, url));

const patchFetcher = async (url: string, body: any, headers?: Record<string, string>) =>
  fetch(url, {
    method: Method.PATCH,
    headers: await getHeaders(headers),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(res, Method.PATCH, url));

const deleteFetcher = async (url: string, body: any, headers?: Record<string, string>) =>
  fetch(url, {
    method: Method.DELETE,
    headers: await getHeaders(headers),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(res, Method.DELETE, url));

export { getFetcher, postFetcher, putFetcher, deleteFetcher, patchFetcher };

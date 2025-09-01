import { HeadersKey } from "@/common/constants/header";
import { Method } from "@/common/constants/method";
import { getHeaders } from "@/common/utils/getHeaders";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

async function handleResponse(res: Response, method: string, url: string) {
  return res.json();
}

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
    headers: { browserrefreshed: "false", ...getHeaders(headers) },
  }).then((res) => handleResponse(res, Method.GET, fullUrl));
};

const postFetcher = async (url: string, body: any, headers?: Record<string, string>) => {
  
  return fetch(url, {
    method: Method.POST,
    headers: getHeaders(headers),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(res, Method.POST, url));
};

const putFetcher = async (url: string, body: any, headers?: Record<string, string>) =>
  fetch(url, {
    method: Method.PUT,
    headers: getHeaders(headers),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(res, Method.PUT, url));

const patchFetcher = async (url: string, body: any, headers?: Record<string, string>) =>
  fetch(url, {
    method: Method.PATCH,
    headers: getHeaders(headers),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(res, Method.PATCH, url));

const deleteFetcher = async (url: string, body: any, headers?: Record<string, string>) =>
  fetch(url, {
    method: Method.DELETE,
    headers: getHeaders(headers),
    body: JSON.stringify(body),
  }).then((res) => handleResponse(res, Method.DELETE, url));

export { getFetcher, postFetcher, putFetcher, deleteFetcher, patchFetcher };

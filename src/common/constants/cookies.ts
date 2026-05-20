import { CookieAttributes } from "js-cookie";

export enum CookiesKey {
  DEVICE_ID = "_did",
  Lang = "_lg",
  IP = "_ip_enc",
  LAT = "_lat",
  LNG = "_lng",
  APP_VERSION = "_av",
  SFW_MODE = "_sfw",
}

export const setCookiesOption1Y:CookieAttributes = {
  expires: 3650,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export const setCookiesOption1H:CookieAttributes = {
  expires: 60 / 1440, 
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

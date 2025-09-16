import { HeadersKey } from "../constants/header";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import pkg from "../../../package.json";

export const getHeaders =  (headers?: Record<string, string>) => {
  const deviceId = Cookies.get(HeadersKey.DeviceId) || uuidv4();
  const lang = Cookies.get(HeadersKey.Lang) || "";
  const userAgent = Cookies.get(HeadersKey.UserAgent) || "";
  const latitude = Cookies.get(HeadersKey.Latitude) || "";
  const longitude = Cookies.get(HeadersKey.Longitude) || "";
  Cookies.set(HeadersKey.DeviceId, deviceId);
  const header = {
    [HeadersKey.Authorization] : "",
    [HeadersKey.ContentType]: "application/json",
    [HeadersKey.DeviceId]: deviceId,
    [HeadersKey.Lang]: lang,
    [HeadersKey.Origin]: process.env.NEXTAUTH_URL || "",
    [HeadersKey.UserAgent]: userAgent,
    [HeadersKey.AppVersion]: pkg.version, 
    [HeadersKey.Latitude]: latitude,
    [HeadersKey.Longitude]: longitude,
    ...(headers || {}),
  };
  return header;
};

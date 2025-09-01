import Cookies from "js-cookie";
import { HeadersKey } from "../constants/header";
import { v4 as uuidv4 } from "uuid";

export const getHeaders =  (headers?: Record<string, string>) => {
  const deviceId = Cookies.get(HeadersKey.DeviceId) || uuidv4();
  const lang = Cookies.get(HeadersKey.Lang) || "";
  Cookies.set(HeadersKey.DeviceId, deviceId);
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

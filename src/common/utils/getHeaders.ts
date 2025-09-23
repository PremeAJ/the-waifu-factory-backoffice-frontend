import { HeadersKey } from "../constants/header";

export const getHeaders = async (headers?: Record<string, string>) => {
  const header = {
    [HeadersKey.ContentType]: "application/json",
    ...(headers || {}),
  };
  return header;
};

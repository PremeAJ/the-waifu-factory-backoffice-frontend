function getContentTypeAndExt(
  file: File | Blob | string | ArrayBuffer | Uint8Array
) {
  let ext = "png";
  let contentType = "image/png";

  if (typeof file === "string" && file.startsWith("data:")) {
    const matches = file.match(/^data:(.+);base64,/);
    if (matches) {
      contentType = matches[1];
      ext = contentType.split("/")[1] || "png";
    }
  } else if (file instanceof File) {
    ext = file.name.split(".").pop() || "png";
    contentType = file.type;
  } else if (file instanceof Blob) {
    contentType = file.type || "application/octet-stream";
    // ไม่สามารถหา ext ได้จาก Blob ธรรมดา
    ext = contentType.split("/")[1] || "bin";
  } else if (file instanceof ArrayBuffer || file instanceof Uint8Array) {
    contentType = "application/octet-stream";
    ext = "bin";
  }

  return { contentType, ext };
}
export default getContentTypeAndExt;
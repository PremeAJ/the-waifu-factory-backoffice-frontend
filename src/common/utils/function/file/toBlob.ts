import getContentTypeAndExt from "./getContentTypeAndExt";

/**
 * แปลง input หลายแบบให้กลายเป็น Blob
 * @param input base64 (data URL) | ArrayBuffer | Uint8Array | Blob | File
 * @param contentType optional MIME type (ถ้าระบุ)
 */
function toBlob(input: string | ArrayBuffer | Uint8Array | Blob | File, contentType?: string): Blob | null {
  // ถ้าเป็น Blob หรือ File อยู่แล้ว
  if (input instanceof Blob) return input;
  if (input instanceof File) return input;

  // ใช้ getContentTypeAndExt เพื่อหา contentType ที่ถูกต้อง
  const { contentType: detectedType } = getContentTypeAndExt(input as any);
  const finalType = contentType || detectedType || "application/octet-stream";

  // ถ้าเป็น base64 data URL
  if (typeof input === "string" && input.startsWith("data:")) {
    const matches = input.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return null;
    const base64Data = matches[2];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: finalType });
  }

  // ถ้าเป็น ArrayBuffer หรือ Uint8Array
  if (input instanceof ArrayBuffer) {
    return new Blob([input], { type: finalType });
  }
  if (input instanceof Uint8Array) {
    return new Blob([input], { type: finalType });
  }

  return null;
}

export default toBlob;

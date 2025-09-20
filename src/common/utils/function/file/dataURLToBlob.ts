export function dataURLToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");
  const meta = parts[0] || "";
  const base64 = parts[1] || "";
  const match = meta.match(/:(.*?);/);
  const mime = match ? match[1] : "application/octet-stream";
  const binary = atob(base64);
  const len = binary.length;
  const u8 = new Uint8Array(len);
  for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
  return new Blob([u8], { type: mime });
}

export const dataURLToFile = (dataUrl: string, filename = "avatar.jpg"): File => {
  const [meta, base64] = dataUrl.split(",");
  const mimeMatch = meta.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const binary = atob(base64);
  const len = binary.length;
  const u8 = new Uint8Array(len);
  for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
  return new File([u8], filename, { type: mime });
};

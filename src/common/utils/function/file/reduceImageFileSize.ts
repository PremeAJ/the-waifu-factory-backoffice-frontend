import imageCompression from "browser-image-compression";

async function reduceImageFileSize(
  input: File | Blob | ArrayBuffer | string,
  maxSize = 800 * 1024 // 800KB
): Promise<File> {
  let file: File;

  // base64 (data URL)
  if (typeof input === "string" && input.startsWith("data:")) {
    const arr = input.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    file = new File([u8arr], "image.png", { type: mime });
  }
  else if (input instanceof ArrayBuffer) {
    file = new File([input], "image.png", { type: "image/png" });
  }
  else if (input instanceof Blob) {
    file = input instanceof File ? input : new File([input], "image.png", { type: input.type || "image/png" });
  } else {
    throw new Error("Unsupported file type");
  }

  const options = {
    maxSizeMB: maxSize / 1024 / 1024,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    return file;
  }
}

export default reduceImageFileSize;
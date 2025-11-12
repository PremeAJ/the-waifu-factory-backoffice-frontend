import { UploadedFile } from './types';

export const isImageFile = (file: UploadedFile): boolean => {
  // ✅ แก้ไข: ตรวจสอบจาก file.type ก่อน จากนั้นตรวจสอบจาก URL
  if (file.file.type.startsWith("image/")) {
    return true;
  }
  
  // ✅ ตรวจสอบจาก URL ถ้ามี (รองรับทั้ง URL ที่มี query parameters)
  if (file.url) {
    // แยก URL ออกจาก query parameters ก่อนเช็ค extension
    const urlWithoutQuery = file.url.split('?')[0];
    return urlWithoutQuery.match(/\.(jpeg|jpg|png|gif|webp)$/i) !== null;
  }
  
  return false;
};

export const normalizeAccept = (accept: string | string[] | undefined): Record<string, string[]> | undefined => {
  if (Array.isArray(accept)) {
    return accept.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>);
  } else if (typeof accept === "string") {
    return { [accept]: [] };
  }
  return undefined;
};

export const formatBytes = (bytes?: number) => {
  if (!bytes && bytes !== 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

type FormatDropzoneErrorsOpts = {
  maxSize?: number;
  maxFiles?: number;
  accept?: string | string[] | Record<string, string[]>;
};

export const formatDropzoneErrors = (rejections: any[], opts: FormatDropzoneErrorsOpts = {}): string => {
  if (!rejections?.length) return "";
  const acceptList = Array.isArray(opts.accept)
    ? opts.accept.join(", ")
    : typeof opts.accept === "string"
      ? opts.accept
      : Object.keys(opts.accept || {}).join(", ");

  const lines: string[] = [];
  for (const r of rejections) {
    const name = r?.file?.name || "ไฟล์";
    const size = r?.file?.size;
    for (const e of r?.errors || []) {
      switch (e.code) {
        case "file-too-large":
          lines.push(`ไฟล์ ${name} มีขนาด ${formatBytes(size)} เกินกำหนด (${formatBytes(opts.maxSize)})`);
          break;
        case "file-too-small":
          lines.push(`ไฟล์ ${name} มีขนาดเล็กเกินไป`);
          break;
        case "file-invalid-type":
          lines.push(`ไฟล์ ${name} ไม่รองรับประเภทนี้ (รองรับ: ${acceptList || "-"})`);
          break;
        case "too-many-files":
          lines.push(`เลือกไฟล์เกินจำนวนที่กำหนด (สูงสุด ${opts.maxFiles ?? "-"} ไฟล์)`);
          break;
        default:
          lines.push(e.message || `ไม่สามารถอัปโหลดไฟล์ ${name}`);
      }
    }
  }
  return Array.from(new Set(lines)).join("\n");
};

export const CLIENT_MAX_BYTES = 2 * 1024 * 1024;

export const isBrowserImage = (file: File) => (file?.type || "").startsWith("image/");

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

const loadImageFromFile = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    const url = URL.createObjectURL(file);
    img.src = url;
  });

const preserveOriginalName = (originalFile: File, compressedBlob: Blob): File => {
  const originalName = originalFile.name;
  const ext = originalName.lastIndexOf('.');
  const baseName = ext !== -1 ? originalName.substring(0, ext) : originalName;
  const newName = `${baseName}.jpg`;
  
  return new File([compressedBlob], newName, { 
    type: 'image/jpeg', 
    lastModified: Date.now() 
  });
};

const compressViaCanvas = async (file: File, targetBytes: number) => {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  let scale = 1.0;
  let quality = 0.9;
  const outType = "image/jpeg";
  let best: Blob | null = null;

  for (let i = 0; i < 10; i++) {
    const tw = Math.max(200, Math.round(w * scale));
    const th = Math.max(200, Math.round(h * scale));
    canvas.width = tw;
    canvas.height = th;
    ctx.clearRect(0, 0, tw, th);
    ctx.drawImage(img, 0, 0, tw, th);
    const blob = await canvasToBlob(canvas, outType, quality);
    if (blob) {
      best = blob;
      if (blob.size <= targetBytes) break;
    }
    if (quality > 0.55) quality = Math.max(0.5, quality - 0.1);
    else scale = Math.max(0.4, scale * 0.9);
  }

  try { URL.revokeObjectURL(img.src); } catch {}
  if (!best || best.size >= file.size) return file;

  return preserveOriginalName(file, best);
};

export const compressImageIfNeeded = async (
  file: File,
  opts?: { targetBytes?: number }
): Promise<File> => {
  if (!isBrowserImage(file)) return file;
  const target = Math.max(32 * 1024, opts?.targetBytes ?? CLIENT_MAX_BYTES);
  if (file.size <= target) return file;

  const originalName = file.name;

  try {
    const imageCompression = (await import("browser-image-compression")).default;
    const compressedBlob = await imageCompression(file, {
      maxSizeMB: target / (1024 * 1024),
      useWebWorker: true,
      initialQuality: 0.85,
      alwaysKeepResolution: false,
      fileType: "image/jpeg",
    });
    
    if (compressedBlob.size < file.size) {
      return preserveOriginalName(file, compressedBlob);
    }
  } catch {
  }

  return await compressViaCanvas(file, target);
};


export function truncateFileName(name: string, max = 12): string {
  if (!name || name.length <= max) return name;

  const lastDot = name.lastIndexOf(".");
  const hasExt = lastDot > 0 && lastDot < name.length - 1;
  const ext = hasExt ? name.slice(lastDot + 1) : "";
  const base = hasExt ? name.slice(0, lastDot) : name;

  const reserve = (ext ? ext.length + 1 : 0) + 3;
  if (max <= reserve) return name.slice(0, max - 1) + "…";

  const remain = max - reserve;
  const head = Math.ceil(remain / 2);
  const tail = Math.floor(remain / 2);

  const shortened = `${base.slice(0, head)}...${tail > 0 ? base.slice(-tail) : ""}`;
  return ext ? `${shortened}.${ext}` : shortened;
}
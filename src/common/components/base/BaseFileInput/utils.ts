import { UploadedFile } from './types';

export const isImageFile = (file: UploadedFile): boolean => {
  return !!file.url && 
    (file.url.match(/\.(jpeg|jpg|png|gif|webp)$/i) !== null || file.file.type.startsWith("image/"));
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

const changeExt = (name: string, ext: string) => {
  const idx = name.lastIndexOf(".");
  return (idx === -1 ? name : name.slice(0, idx)) + "." + ext.replace(/^\./, "");
};

// fallback แบบ Canvas
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

  return new File([best], changeExt(file.name || "image", "jpg"), { type: outType, lastModified: Date.now() });
};

// ใช้ไลบรารีเป็นหลัก แล้วค่อย fallback
export const compressImageIfNeeded = async (
  file: File,
  opts?: { targetBytes?: number }
): Promise<File> => {
  if (!isBrowserImage(file)) return file;
  const target = Math.max(32 * 1024, opts?.targetBytes ?? CLIENT_MAX_BYTES);
  if (file.size <= target) return file;

  try {
    const imageCompression = (await import("browser-image-compression")).default;
    const out = await imageCompression(file, {
      maxSizeMB: target / (1024 * 1024),
      useWebWorker: true,
      initialQuality: 0.85,
      alwaysKeepResolution: false,
      // ถ้าอยากบังคับแปลงเป็น JPEG เพื่อลดขนาด:
      fileType: "image/jpeg",
    });
    if (out.size < file.size) return out as File;
  } catch {
    // ignore and fallback
  }

  return await compressViaCanvas(file, target);
};
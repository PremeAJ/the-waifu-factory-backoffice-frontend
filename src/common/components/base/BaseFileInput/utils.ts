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
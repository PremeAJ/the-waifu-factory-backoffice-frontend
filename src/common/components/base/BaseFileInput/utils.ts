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
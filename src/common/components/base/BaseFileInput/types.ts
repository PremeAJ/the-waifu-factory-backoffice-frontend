import { StorageBucket } from "@/common/contexts/UploadContext/interfaces/upload";

export interface UploadedFile {
  file: File;
  id: string;
  url?: string;
  originName?: string;
  uploading: boolean;
  progress: number;
  error?: string;
  deleting?: boolean;
}

export interface FileValue {
  id: string;
  url?: string;
  originName?: string;
}

export interface BaseFileInputProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  multiple?: boolean;
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  autoUpload?: boolean;
  toBucket?: StorageBucket;
  finalize?: boolean;
  onChange?: (files: File[]) => void;
  onUploadComplete?: (files: FileValue[]) => void; // ✅ เปลี่ยนจาก string[] เป็น FileValue[]
  value?: (string | FileValue)[];
}
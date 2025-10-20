import { StorageBucket } from "@/common/contexts/UploadContext/interfaces/upload";

export interface UploadedFile {
  file: File;
  id: string;
  url?: string;
  uploading: boolean;
  progress: number;
  error?: string;
  originName?: string;
  deleting?: boolean;
}

export interface BaseFileInputProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  multiple?: boolean;
  accept?: string | string[];
  maxSize?: number;
  maxFiles?: number;
  autoUpload?: boolean;
  toBucket?: StorageBucket;
  finalize?: boolean;
  onChange?: (files: File[]) => void;
  onUploadComplete?: (fileIds: string[]) => void;
  value?: string[];
}
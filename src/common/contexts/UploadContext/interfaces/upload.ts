// อิงตาม StorageBucket Enum ใน Prisma Schema
export enum StorageBucket {
  USER_AVATAR = 'user_avatar',
  COMPANY_AVATAR = 'company_avatar',
  DRAFT = 'draft',
  PRODUCT_THUMBNAIL = 'product_thumbnail',
  PRODUCT_DETAIL = 'product_detail'
}

export interface UploadDraftResult {
  id: string;
  bucket: StorageBucket;
  storagePath: string;
  url: string | null;
  size: number;
  ext: string;
  originName?: string;
}

export interface FileMetadata {
  id: string;
  bucket: StorageBucket;
  storagePath: string;
  url?: string;
  originName?: string;
}

// เพิ่ม FileUrlResponse interface
export interface FileUrlResponse {
  id: string;
  url: string;
  bucket: StorageBucket;
  storagePath: string;
  expiresIn?: number;
  originName?: string;
}

export interface GetFileUrlParams {
  public?: boolean; 
  expires?: number;
}

export interface FinalizeFilesParams {
  fileIds: string[];
  toBucket: StorageBucket;
}

export interface UploadContextType {
  isUploading: boolean;
  progress: number;
  error: any;
  
  // ฟังก์ชันพื้นฐาน
  uploadFile: (file: File, onProgress?: (progress: number) => void) => Promise<UploadDraftResult>;
  getFileUrl: (fileId: string, params?: GetFileUrlParams) => Promise<FileUrlResponse>;
  finalizeFiles: (params: FinalizeFilesParams) => Promise<FileMetadata[]>;
  deleteDraft: (fileId: string) => Promise<void>;
  
  // เพิ่มฟังก์ชันใหม่เพื่อดึง URL หลายไฟล์พร้อมกัน
  getBulkFileUrls: (fileIds: string[], params?: GetFileUrlParams) => Promise<Record<string, FileUrlResponse>>;
  
  // ฟังก์ชันช่วยเหลือ
  uploadMultipleFiles: (files: File[]) => Promise<UploadDraftResult[]>;
  uploadAndFinalize: (file: File, toBucket: StorageBucket) => Promise<FileMetadata>;
}
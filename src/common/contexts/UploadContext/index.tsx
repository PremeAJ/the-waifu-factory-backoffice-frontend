"use client";
import React, { createContext, useContext, useState } from 'react';
import { 
  UploadContextType, 
  UploadDraftResult, 
  FileMetadata, 
  GetFileUrlParams,
  FinalizeFilesParams,
  StorageBucket,
  FileUrlResponse  // เพิ่ม import FileUrlResponse
} from './interfaces/upload';
import { useDialog } from '../DialogContext';
import { getFetcher, postFetcher, deleteFetcher } from "@/app/api/globalFetcher";
import axios, { AxiosProgressEvent } from 'axios';

export const UploadContext = createContext<UploadContextType>({} as UploadContextType);

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<any>(null);
  const { showError } = useDialog();
  const endpoint = '/api/upload';

  // เพิ่ม state สำหรับ cache
  const [urlCache, setUrlCache] = useState<Record<string, FileUrlResponse>>({});

  const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<UploadDraftResult> => {
    try {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      // ใช้ axios โดยตรงเพราะต้องส่ง FormData และติดตาม progress
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
            if (onProgress) onProgress(percentCompleted);
          }
        },
      });

      // แก้จุดนี้: return เฉพาะข้อมูลที่อยู่ใน data.data
      return response.data.data; // แทนที่จะเป็น response.data

    } catch (err: any) {
      setError(err);
      showError({ message: err.message || 'Upload failed', title: 'Upload failed' });
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  // ปรับปรุงฟังก์ชัน getFileUrl ให้ใช้ cache
  const getFileUrl = async (fileId: string, params?: GetFileUrlParams): Promise<FileUrlResponse> => {
    const map = await getBulkFileUrls([fileId], params);
    const data = map[fileId];
    if (!data) {
      throw new Error(`File URL not found for id: ${fileId}`);
    }
    return data;
  };

  const finalizeFiles = async (params: FinalizeFilesParams): Promise<FileMetadata[]> => {
    try {
      const response = await postFetcher(`${endpoint}/finalize`, params);
      // แก้จุดนี้: ตรวจสอบโครงสร้างของ response
    return response.data?.finalized || response.finalized || [];
    } catch (err: any) {
      showError({ message: err.message || 'Failed to finalize files', title: 'Error' });
      throw err;
    }
  };

  const deleteDraft = async (fileId: string): Promise<void> => {
    try {
      const response = await deleteFetcher(`${endpoint}/${fileId}`, {});
      return response;
    } catch (err: any) {
      showError({ message: err.message || 'Failed to delete draft', title: 'Error' });
      throw err;
    }
  };

  const uploadMultipleFiles = async (files: File[]): Promise<UploadDraftResult[]> => {
    const results: UploadDraftResult[] = [];
    
    for (const file of files) {
      try {
        const result = await uploadFile(file);
        results.push(result);
      } catch (error) {
        // ทำต่อแม้จะมีไฟล์ที่อัปโหลดไม่สำเร็จ
        console.error('Error uploading file:', file.name, error);
      }
    }
    
    return results;
  };

  const uploadAndFinalize = async (
    file: File, 
    toBucket: StorageBucket
  ): Promise<FileMetadata> => {
    const uploadResult = await uploadFile(file);
    const finalizeResult = await finalizeFiles({
      fileIds: [uploadResult.id],
      toBucket
    });
    
    if (!finalizeResult || finalizeResult.length === 0) {
      throw new Error('Failed to finalize file');
    }
    
    // เพิ่ม originName จาก uploadResult
    return {
      ...finalizeResult[0],
      originName: uploadResult.originName
    };
  };

  // ปรับปรุงฟังก์ชัน getBulkFileUrls ให้ใช้ cache
  const getBulkFileUrls = async (fileIds: string[], params?: GetFileUrlParams): Promise<Record<string, FileUrlResponse>> => {
    if (!fileIds.length) return {};
    
    // แยกไฟล์ที่มีใน cache และไม่มีใน cache
    const cachedResults: Record<string, FileUrlResponse> = {};
    const idsToFetch: string[] = [];
    
    if (params?.public) {
      fileIds.forEach(id => {
        if (urlCache[id]) {
          cachedResults[id] = urlCache[id];
        } else {
          idsToFetch.push(id);
        }
      });
      
      // ถ้ามีข้อมูลใน cache ครบแล้ว ไม่ต้อง fetch ข้อมูลใหม่
      if (idsToFetch.length === 0) {
        return cachedResults;
      }
    } else {
      // กรณีไม่ใช่ public URL ต้อง fetch ใหม่ทั้งหมด
      idsToFetch.push(...fileIds);
    }
    
    try {
      const response = await postFetcher(`${endpoint}/urls`, {
        ids: idsToFetch,
        public: params?.public,
        expires: params?.expires
      });
      
      const newResults: Record<string, FileUrlResponse> = {};
      
      if (response?.data?.files && Array.isArray(response?.data?.files)) {
        response?.data?.files.forEach((file: any) => {
          if (file.id) {
            newResults[file.id] = file;
            
            // เก็บผลลัพธ์ลง cache ถ้าเป็นการเรียกแบบ public
            if (params?.public) {
              cachedResults[file.id] = file;
            }
          }
        });
      }
      
      // อัพเดต cache
      if (params?.public && Object.keys(newResults).length > 0) {
        setUrlCache(prev => ({
          ...prev,
          ...newResults
        }));
      }
      
      // รวมผลลัพธ์จาก cache และที่ fetch มาใหม่
      return { ...cachedResults, ...newResults };
    } catch (err: any) {
      showError({ message: err.message || 'Failed to get file URLs', title: 'Error' });
      throw err;
    }
  };

  // อย่าลืมเพิ่มเข้าไปใน value object ที่ส่งให้ context
  const value: UploadContextType = {
    isUploading,
    progress,
    error,
    uploadFile,
    getFileUrl,
    finalizeFiles,
    deleteDraft,
    getBulkFileUrls, // เพิ่มฟังก์ชันใหม่
    uploadMultipleFiles,
    uploadAndFinalize,
  };

  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
};

export const useUpload = () => useContext(UploadContext);
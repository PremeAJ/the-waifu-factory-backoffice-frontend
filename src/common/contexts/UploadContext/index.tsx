"use client";
import React, { createContext, useContext, useState } from 'react';
import { 
  UploadContextType, 
  UploadDraftResult, 
  FileMetadata, 
  GetFileUrlParams,
  FinalizeFilesParams,
  StorageBucket,
  FileUrlResponse
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

  const [urlCache, setUrlCache] = useState<Record<string, FileUrlResponse>>({});

  const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<UploadDraftResult> => {
    try {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

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

      return response.data.data;

    } catch (err: any) {
      setError(err);
      showError({ message: err.message || 'Upload failed', title: 'Upload failed' });
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

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
    
    return {
      ...finalizeResult[0],
      originName: uploadResult.originName
    };
  };

  const getBulkFileUrls = async (fileIds: (string | any)[], params?: GetFileUrlParams): Promise<Record<string, FileUrlResponse>> => {
    if (!fileIds.length) return {};
    
    // ✅ เช็คว่า fileIds เป็น object ที่มี url แล้วหรือไม่
    const hasUrls = fileIds.some(item => typeof item === 'object' && item.url);
    
    if (hasUrls) {
      const result: Record<string, FileUrlResponse> = {};
      fileIds.forEach((item: any) => {
        if (typeof item === 'object' && item.id) {
          result[item.id] = item;
        }
      });
      return result;
    }
    
    // ถ้าเป็น array ของ string (fileIds) ให้เรียก API
    const stringIds = fileIds.filter(id => typeof id === 'string') as string[];
    
    if (!stringIds.length) return {};
    
    // ✅ แก้ไข: ใช้ urlCache แทน cachedResults
    const cachedResults: Record<string, FileUrlResponse> = {};
    const uncachedIds: string[] = [];
    
    // เช็ค cache ก่อน
    stringIds.forEach(id => {
      if (urlCache[id]) {
        cachedResults[id] = urlCache[id];
      } else {
        uncachedIds.push(id);
      }
    });
    
    // ถ้าทุก ID อยู่ใน cache แล้ว ไม่ต้องเรียก API
    if (uncachedIds.length === 0) {
      return cachedResults;
    }
    
    try {
      const response = await postFetcher(`${endpoint}/urls`, {
        ids: uncachedIds,
        public: params?.public,
        expires: params?.expires
      });
      
      const newResults: Record<string, FileUrlResponse> = {};
      
      if (response?.data?.files && Array.isArray(response?.data?.files)) {
        response?.data?.files.forEach((file: any) => {
          if (file.id) {
            newResults[file.id] = file;
          }
        });
      }
      
      // อัพเดต cache ถ้าเป็นการเรียกแบบ public
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

  const value: UploadContextType = {
    isUploading,
    progress,
    error,
    uploadFile,
    getFileUrl,
    finalizeFiles,
    deleteDraft,
    getBulkFileUrls,
    uploadMultipleFiles,
    uploadAndFinalize,
  };

  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
};

export const useUpload = () => useContext(UploadContext);
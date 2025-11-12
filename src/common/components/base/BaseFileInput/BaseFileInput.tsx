"use client";
import { normalizeAccept, isImageFile, formatDropzoneErrors, compressImageIfNeeded, CLIENT_MAX_BYTES } from './utils';
import { StorageBucket } from "@/common/contexts/UploadContext/interfaces/upload";
import { UploadedFile, BaseFileInputProps, FileValue } from './types';
import { useDropzone } from "react-dropzone";
import { useUpload } from "@/common/contexts/UploadContext";
import BaseLabel from "../BaseLabel";
import Box from "@mui/material/Box";
import DropzoneArea from './DropzoneArea';
import FileLightbox from './FileLightbox';
import FileList from './FileList';
import React, { useCallback, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

const BaseFileInput: React.FC<BaseFileInputProps> = ({
  label,
  required = false,
  placeholder = "Drag & drop files here, or click to select files",
  multiple = false,
  accept = ["image/png", "image/jpeg", "image/jpg"],
  maxSize,
  maxFiles,
  autoUpload = false,
  toBucket = StorageBucket.DRAFT,
  finalize = false,
  onChange,
  onUploadComplete,
  value,
}) => {
  console.log("🚀 ~ BaseFileInput ~ value:", value)
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { uploadFile, finalizeFiles, deleteDraft, isUploading } = useUpload();
  
  const imageFiles = files.filter(isImageFile);
  
  const isMaxFilesReached = !multiple 
    ? files.length >= 1 
    : maxFiles 
    ? files.length >= maxFiles 
    : false;

  // ❌ ลบการเรียก getBulkFileUrls ออก - ใช้ value ที่ส่งมาโดยตรง
  useEffect(() => {
    if (!value?.length) {
      setFiles([]);
      return;
    }
    
    console.log('BaseFileInput value:', value); // ✅ Debug log
    
    // ถ้า value เป็น array ของ string (fileIds) ให้แปลงเป็น UploadedFile
    const existingFiles: UploadedFile[] = value.map((item: any) => {
      // ถ้าเป็น string (fileId) ให้สร้าง dummy file
      if (typeof item === 'string') {
        const dummyFile = new File([""], item, { type: "image/jpeg" });
        return {
          file: dummyFile,
          id: item,
          url: undefined, // ✅ ไม่มี URL ให้ undefined
          uploading: false,
          progress: 100
        };
      }
      
      // ถ้าเป็น object ที่มี id และ url แล้ว (จาก backend)
      const fileName = item.originName || item.id || "file";
      const fileType = item.url?.match(/\.(jpeg|jpg|png|gif|webp)$/i) 
        ? "image/jpeg" 
        : "application/octet-stream";
      
      const dummyFile = new File([""], fileName, { type: fileType });
      
      console.log('Mapping file item:', { // ✅ Debug log
        id: item.id,
        url: item.url,
        originName: item.originName
      });
      
      return {
        file: dummyFile,
        id: item.id,
        url: item.url || undefined, // ✅ ต้องมี url ถ้าเป็น object
        originName: item.originName || fileName,
        uploading: false,
        progress: 100
      };
    });
    
    console.log('Existing files:', existingFiles); // ✅ Debug log
    setFiles(existingFiles);
  }, [value]);

  const handleUploadFile = async (file: File): Promise<UploadedFile> => {
    try {
      const result = await uploadFile(file, (progress) => {
        setFiles((prevFiles) => 
          prevFiles.map(f => 
            f.file === file ? { ...f, progress } : f
          )
        );
      });

      if (finalize) {
        const finalizeResult = await finalizeFiles({
          fileIds: [result.id],
          toBucket
        });
        
        if (finalizeResult && finalizeResult.length > 0) {
          return {
            file,
            id: finalizeResult[0].id,
            url: finalizeResult[0].url || undefined, // ✅ แก้ไข: เปลี่ยน null เป็น undefined
            originName: finalizeResult[0].originName || file.name,
            uploading: false,
            progress: 100,
          };
        }
      }

      return {
        file,
        id: result.id,
        url: result.url || undefined, // ✅ แก้ไข: เปลี่ยน null เป็น undefined
        originName: result.originName || file.name,
        uploading: false,
        progress: 100,
      };
    } catch (err: any) {
      return {
        file,
        id: "",
        uploading: false,
        progress: 0,
        error: err.message || "Upload failed"
      };
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[]) => {
      const targetBytes = Math.min(
        CLIENT_MAX_BYTES,
        typeof maxSize === "number" && maxSize > 0 ? maxSize : CLIENT_MAX_BYTES
      );

      const processedFiles = await Promise.all(
        acceptedFiles.map(async (f) => {
          if ((f.type || "").startsWith("image/") && f.size > targetBytes) {
            return await compressImageIfNeeded(f, { targetBytes });
          }
          return f;
        })
      );

      let validFiles = processedFiles;
      let errorMsg = "";

      if (maxSize) {
        validFiles = validFiles.filter((file) => {
          if (file.size > maxSize) {
            errorMsg = `ไฟล์ ${file.name} มีขนาดเกิน ${Math.round(maxSize / 1024)} KB`;
            return false;
          }
          return true;
        });
      }

      const effectiveMaxFiles = !multiple ? 1 : maxFiles;
      
      const totalFiles = files.length + validFiles.length;
      if (effectiveMaxFiles && totalFiles > effectiveMaxFiles) {
        validFiles = validFiles.slice(0, Math.max(0, effectiveMaxFiles - files.length));
        if (!multiple) {
          errorMsg = `เลือกได้เพียง 1 ไฟล์เท่านั้น`;
        } else {
          errorMsg = `เลือกไฟล์ได้สูงสุด ${effectiveMaxFiles} ไฟล์`;
        }
      }

      const newFiles: UploadedFile[] = validFiles.map(file => ({
        file,
        id: "",
        uploading: autoUpload,
        progress: 0
      }));
      
      setFiles(prev => (multiple ? [...prev, ...newFiles] : newFiles));

      const rejectionMsg = formatDropzoneErrors(fileRejections, { maxSize, maxFiles: effectiveMaxFiles, accept });
      setError([errorMsg, rejectionMsg].filter(Boolean).join("\n") || null);

      if (onChange) {
        const allFiles = multiple ? [...files.map(f => f.file), ...validFiles] : validFiles;
        onChange(allFiles);
      }

      if (autoUpload) {
        const uploadedFiles: UploadedFile[] = [];
        for (const file of validFiles) {
          const uploadedFile = await handleUploadFile(file);
          uploadedFiles.push(uploadedFile);
        }

        setFiles(prev => {
          const filtered = prev.filter(p => !uploadedFiles.some(u => u.file === p.file));
          return [...filtered, ...uploadedFiles];
        });

        if (onUploadComplete) {
          // ✅ ส่ง FileValue[] แทน string[]
          const fileValues: FileValue[] = uploadedFiles
            .filter(f => f.id && !f.error)
            .map(f => ({
              id: f.id,
              url: f.url,
              originName: f.originName
            }));
          onUploadComplete(fileValues);
        }
      }
    },
    [maxSize, maxFiles, files, autoUpload, onChange, onUploadComplete, multiple]
  );

  const normalizedAccept = normalizeAccept(accept);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: normalizedAccept,
    disabled: isMaxFilesReached,
  });

  const handleRemoveFile = async (index: number) => {
    const fileToRemove = files[index];
    
    const isDisplayedInLightbox = lightboxOpen && 
      imageFiles.findIndex(img => files.indexOf(img) === index) === currentImageIndex;
    
    if (isDisplayedInLightbox) {
      setLightboxOpen(false);
    }
    
    setFiles(prev => 
      prev.map((file, i) => 
        i === index ? { ...file, deleting: true } : file
      )
    );
    
    try {
      if (fileToRemove.id) {
        await deleteDraft(fileToRemove.id);
      }
      
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
      
      if (onChange) {
        onChange(newFiles.map(f => f.file));
      }
      
      if (onUploadComplete) {
        // ✅ ส่ง FileValue[] แทน string[]
        const fileValues: FileValue[] = newFiles
          .filter(f => f.id)
          .map(f => ({
            id: f.id,
            url: f.url,
            originName: f.originName
          }));
        onUploadComplete(fileValues);
      }
      
      const newImageFiles = newFiles.filter(isImageFile);
      
      if (lightboxOpen && currentImageIndex >= newImageFiles.length && newImageFiles.length > 0) {
        setCurrentImageIndex(newImageFiles.length - 1);
      }
      
    } catch (err) {
      console.error("Error deleting file:", err);
      
      setFiles(prev => 
        prev.map((file, i) => 
          i === index ? { ...file, deleting: false, error: "ลบไฟล์ไม่สำเร็จ" } : file
        )
      );
    }
  };

  const handleUploadPendingFiles = async () => {
    const pendingFiles = files.filter(f => !f.id && !f.uploading);
    if (pendingFiles.length === 0) return;
    
    const uploadedFiles: UploadedFile[] = [];
    
    for (const fileItem of pendingFiles) {
      setFiles(prev => prev.map(f => 
        f.file === fileItem.file ? { ...f, uploading: true } : f
      ));
      
      const uploadedFile = await handleUploadFile(fileItem.file);
      uploadedFiles.push(uploadedFile);
    }

    let finalIds: string[] = [];
    setFiles(prev => {
      const filtered = prev.filter(p => !uploadedFiles.some(u => u.file === p.file));
      const merged = [...filtered, ...uploadedFiles];
      finalIds = merged.filter(f => f.id && !f.error).map(f => f.id as string);
      return merged;
    });
    
    if (onUploadComplete) {
      // ✅ ส่ง FileValue[] แทน string[]
      const fileValues: FileValue[] = [];
      setFiles(prev => {
        const filtered = prev.filter(p => !uploadedFiles.some(u => u.file === p.file));
        const merged = [...filtered, ...uploadedFiles];
        
        merged
          .filter(f => f.id && !f.error)
          .forEach(f => {
            fileValues.push({
              id: f.id,
              url: f.url,
              originName: f.originName
            });
          });
        
        return merged;
      });
      
      onUploadComplete(fileValues);
    }
  };

  const handleOpenLightbox = (index: number) => {
    const imageIndex = imageFiles.findIndex(img => 
      files.indexOf(img) === index
    );
    
    if (imageIndex !== -1) {
      setCurrentImageIndex(imageIndex);
      setLightboxOpen(true);
    }
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev > 0 ? prev - 1 : imageFiles.length - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev < imageFiles.length - 1 ? prev + 1 : 0
    );
  };
  
  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <Box>
      {label && (
        <BaseLabel sx={{ m: 2 }} required={required}>
          {label}
        </BaseLabel>
      )}
      
      {/* แสดง Dropzone เฉพาะเมื่อยังไม่ครบจำนวนไฟล์ */}
      {!isMaxFilesReached && (
        <DropzoneArea
          placeholder={placeholder}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
        />
      )}
      
      {error && (
        <Typography color="error" mt={1} textAlign="center" sx={{ whiteSpace: 'pre-line' }}>
          {error}
        </Typography>
      )}
      
      <FileList
        files={files}
        maxFiles={!multiple ? 1 : maxFiles}
        autoUpload={autoUpload}
        isUploading={isUploading}
        onOpenLightbox={handleOpenLightbox}
        onUploadPending={handleUploadPendingFiles}
        onRemoveFile={handleRemoveFile}
      />
      
      <FileLightbox
        open={lightboxOpen}
        onClose={handleCloseLightbox}
        imageFiles={imageFiles}
        currentIndex={currentImageIndex}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
      />
    </Box>
  );
};

export default BaseFileInput;
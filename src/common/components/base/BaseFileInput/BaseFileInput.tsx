"use client";
import React, { useCallback, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BaseLabel from "../BaseLabel";
import { useUpload } from "@/common/contexts/UploadContext";
import { StorageBucket } from "@/common/contexts/UploadContext/interfaces/upload";
import { UploadedFile, BaseFileInputProps } from './types';
import { normalizeAccept, isImageFile, formatDropzoneErrors, compressImageIfNeeded, CLIENT_MAX_BYTES } from './utils';
import DropzoneArea from './DropzoneArea';
import FileList from './FileList';
import FileLightbox from './FileLightbox';
import { useDropzone } from "react-dropzone";

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
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { uploadFile, /* getFileUrl, */ getBulkFileUrls, finalizeFiles, deleteDraft, isUploading } = useUpload();
  
  // Filter image files for lightbox
  const imageFiles = files.filter(isImageFile);

  // Handle existing files from value prop
  useEffect(() => {
    const fetchExistingFiles = async () => {
      if (!value?.length) return;
      
      try {
        const filesMap = await getBulkFileUrls(value, { public: true });
        const existingFiles: UploadedFile[] = [];
        
        for (const fileId of value) {
          try {
            const fileInfo = filesMap[fileId];
            
            if (fileInfo) {
              const fileName = fileInfo.originName || fileInfo.storagePath?.split("/").pop() || fileId;
              const dummyFile = new File([""], fileName, { 
                type: fileInfo.url?.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? "image/jpeg" : "application/octet-stream" 
              });
              
              existingFiles.push({
                file: dummyFile,
                id: fileId,
                url: fileInfo.url,
                originName: fileInfo.originName,
                uploading: false,
                progress: 100
              });
            } 
          } catch (err) {
            console.error(`Error processing file ${fileId}:`, err);
          }
        }
        
        setFiles(existingFiles);
      } catch (err) {
        console.error("Error loading existing files:", err);
      }
    };

    fetchExistingFiles();
  }, [value, getBulkFileUrls]);

  // Upload a single file
  const handleUploadFile = async (file: File): Promise<UploadedFile> => {
    const uploadingFile: UploadedFile = {
      file,
      id: "",
      uploading: true,
      progress: 0,
    };
    
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
          const map = await getBulkFileUrls([finalizeResult[0].id], { public: true });
          const urlResponse = map[finalizeResult[0].id];
          return {
            file,
            id: finalizeResult[0].id,
            url: urlResponse?.url || "",
            originName: urlResponse?.originName || file.name,
            uploading: false,
            progress: 100,
          };
        }
      }

      // เดิม: const urlResponse = await getFileUrl(result.id, { public: true });
      const map = await getBulkFileUrls([result.id], { public: true });
      const urlResponse = map[result.id];

      return {
        file,
        id: result.id,
        url: urlResponse?.url || "",
        originName: urlResponse?.originName || result.originName || file.name,
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

  // Handle file drop
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

      const totalFiles = files.length + validFiles.length;
      if (maxFiles && totalFiles > maxFiles) {
        validFiles = validFiles.slice(0, Math.max(0, maxFiles - files.length));
        errorMsg = `เลือกไฟล์ได้สูงสุด ${maxFiles} ไฟล์`;
      }

      const newFiles: UploadedFile[] = validFiles.map(file => ({
        file,
        id: "",
        uploading: autoUpload,
        progress: 0
      }));
      
      setFiles(prev => (multiple ? [...prev, ...newFiles] : newFiles));

      const rejectionMsg = formatDropzoneErrors(fileRejections, { maxSize, maxFiles, accept });
      setError([errorMsg, rejectionMsg].filter(Boolean).join("\n") || null);

      // 5) แจ้ง parent
      if (onChange) {
        const allFiles = multiple ? [...files.map(f => f.file), ...validFiles] : validFiles;
        onChange(allFiles);
      }

      // 6) อัปโหลดอัตโนมัติหากตั้งค่าไว้
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
          const fileIds = uploadedFiles.filter(f => f.id && !f.error).map(f => f.id);
          onUploadComplete(fileIds);
        }
      }
    },
    [maxSize, maxFiles, files, autoUpload, onChange, onUploadComplete, multiple, handleUploadFile]
  );

  // Setup dropzone: ไม่กำหนด maxSize เพื่อให้ไฟล์ใหญ่เข้ามาให้เราบีบอัดเอง
  const normalizedAccept = normalizeAccept(accept);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: normalizedAccept,
    // maxSize: undefined,
  });

  // Handle remove file
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
        onUploadComplete(newFiles.filter(f => f.id).map(f => f.id));
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

  // Upload pending files
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

    setFiles(prev => {
      const filtered = prev.filter(p => 
        !uploadedFiles.some(u => u.file === p.file)
      );
      return [...filtered, ...uploadedFiles];
    });
    
    if (onUploadComplete) {
      const fileIds = uploadedFiles
        .filter(f => f.id && !f.error)
        .map(f => f.id);
      onUploadComplete(fileIds);
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
      
      <DropzoneArea
        placeholder={placeholder}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
      />
      
      {error && (
        <Typography color="error" mt={1} textAlign="center" sx={{ whiteSpace: 'pre-line' }}>
          {error}
        </Typography>
      )}
      
      <FileList
        files={files}
        maxFiles={maxFiles}
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
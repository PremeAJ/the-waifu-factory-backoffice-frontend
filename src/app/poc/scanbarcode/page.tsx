"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  Chip,
  Stack,
  IconButton,
  Card,
  CardContent
} from "@mui/material";
import { 
  IconCamera, 
  IconCameraOff, 
  IconBulbFilled,
  IconRotate,
  IconX,
  IconBulb
} from "@tabler/icons-react";
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface ScanResult {
  text: string;
  format: string;
  timestamp: Date;
}

const BarcodeScannerPOC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    // Initialize ZXing code reader
    codeReader.current = new BrowserMultiFormatReader();
    
    // Get available cameras
    getCameras();
    
    return () => {
      // Cleanup เมื่อ component unmount
      if (codeReader.current) {
        codeReader.current.reset();
      }
      stopScanning();
    };
  }, []);

  // เพิ่ม useEffect เพื่อจัดการ isScanning state
  useEffect(() => {
    if (!isScanning) {
      stopScanning();
    }
  }, [isScanning]);

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      
      // เลือกกล้องหลัง (rear camera) เป็นค่าเริ่มต้น
      const backCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      
      if (backCamera) {
        setCurrentDeviceId(backCamera.deviceId);
      } else if (videoDevices.length > 0) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error getting cameras:', err);
      setError('ไม่สามารถเข้าถึงกล้องได้');
    }
  };

  const startScanning = async () => {
    try {
      setError("");
      
      if (!codeReader.current || !videoRef.current) {
        throw new Error('Code reader not initialized');
      }

      // ขอสิทธิ์เข้าถึงกล้องก่อน
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: currentDeviceId ? { exact: currentDeviceId } : undefined,
          facingMode: currentDeviceId ? undefined : { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermission(true);

      // ตั้งค่า video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setIsScanning(true);
      
      // รอให้ video พร้อม แล้วค่อยเริ่มสแกน
      setTimeout(() => {
        scanContinuous();
      }, 500);

    } catch (err: any) {
      console.error('Error starting scanner:', err);
      setIsScanning(false);
      
      if (err.name === 'NotAllowedError') {
        setError('กรุณาอนุญาตให้เข้าถึงกล้องเพื่อใช้งานฟีเจอร์นี้');
        setHasPermission(false);
      } else if (err.name === 'NotFoundError') {
        setError('ไม่พบกล้องในอุปกรณ์นี้');
        setHasPermission(false);
      } else {
        setError('เกิดข้อผิดพลาดในการเข้าถึงกล้อง: ' + err.message);
      }
    }
  };

  const scanContinuous = async () => {
    if (!isScanning || !codeReader.current || !videoRef.current) {
      return;
    }

    try {
      // ตรวจสอบว่า video พร้อมหรือยัง
      if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        setTimeout(scanContinuous, 100);
        return;
      }

      // สแกนจาก video element โดยตรง
      const result = await codeReader.current.decodeFromVideoElement(videoRef.current);
      
      if (result) {
        const newResult: ScanResult = {
          text: result.getText(),
          format: result.getBarcodeFormat().toString(),
          timestamp: new Date()
        };

        setScanResults(prev => [newResult, ...prev.slice(0, 4)]);
        
        // เล่นเสียงแจ้งเตือน
        playBeepSound();
        
        // แสดง vibration บนมือถือ
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
        }

        // พักสักครู่แล้วสแกนต่อ (เพื่อไม่ให้ duplicate)
        setTimeout(() => {
          if (isScanning) {
            scanContinuous();
          }
        }, 1000);
      } else {
        // ไม่พบ barcode ลองสแกนต่อ
        setTimeout(() => {
          if (isScanning) {
            scanContinuous();
          }
        }, 100);
      }

    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        console.error('Scan error:', err);
      }
      
      // ลองสแกนต่อ
      setTimeout(() => {
        if (isScanning) {
          scanContinuous();
        }
      }, 100);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    // หยุด code reader
    if (codeReader.current) {
      codeReader.current.reset();
    }
    
    // หยุด video stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    // ล้างค่า video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }
  };

  const toggleTorch = async () => {
    if (!stream) return;

    try {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if ('torch' in capabilities && (capabilities as any).torch) {
        await track.applyConstraints({
          advanced: [{ torch: !torchEnabled } as any]
        });
        setTorchEnabled(!torchEnabled);
      } else {
        setError('อุปกรณ์นี้ไม่รองรับไฟฉาย');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Error toggling torch:', err);
      setError('ไม่สามารถเปิด/ปิดไฟฉายได้');
      setTimeout(() => setError(''), 3000);
    }
  };

  const switchCamera = async () => {
    if (devices.length <= 1) return;

    const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];

    setCurrentDeviceId(nextDevice.deviceId);
    
    if (isScanning) {
      stopScanning();
      // รอให้ cleanup เสร็จ แล้วค่อยเริ่มใหม่
      setTimeout(() => {
        startScanning();
      }, 500);
    }
  };

  const playBeepSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const clearResults = () => {
    setScanResults([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Barcode Scanner POC
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Scanner Interface */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ position: 'relative', textAlign: 'center' }}>
          {/* Video Element */}
          <video
            ref={videoRef}
            style={{
              width: '100%',
              maxWidth: 500,
              height: 'auto',
              backgroundColor: '#000',
              display: isScanning ? 'block' : 'none',
            }}
            playsInline
            muted
            autoPlay
            onLoadedMetadata={() => {
              console.log('Video loaded, ready to scan');
            }}
            onError={(e) => {
              console.error('Video error:', e);
              setError('เกิดข้อผิดพลาดกับวิดีโอ');
            }}
          />

          {/* Hidden Canvas for processing */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />

          {/* Scanner Overlay */}
          {isScanning && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 200,
                height: 200,
                border: '2px solid #ff0000',
                borderRadius: 2,
                pointerEvents: 'none',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -1,
                  left: -1,
                  right: -1,
                  bottom: -1,
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: 2,
                  animation: 'pulse 2s infinite'
                }
              }}
            />
          )}

          {/* Control Buttons */}
          {isScanning && (
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                position: 'absolute', 
                bottom: 16, 
                left: '50%', 
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: 2,
                p: 1
              }}
            >
              <IconButton 
                onClick={toggleTorch}
                sx={{ color: torchEnabled ? 'yellow' : 'white' }}
              >
                {torchEnabled ? <IconBulbFilled /> : <IconBulb />}
              </IconButton>
              
              <IconButton 
                onClick={switchCamera}
                sx={{ color: 'white' }}
                disabled={devices.length <= 1}
              >
                <IconRotate />
              </IconButton>
              
              <IconButton 
                onClick={stopScanning}
                sx={{ color: 'white' }}
              >
                <IconX />
              </IconButton>
            </Stack>
          )}
        </Box>

        {/* Start/Stop Button */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          {!isScanning ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<IconCamera />}
              onClick={startScanning}
              disabled={hasPermission === false}
            >
              เริ่มสแกน Barcode
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="large"
              startIcon={<IconCameraOff />}
              onClick={() => setIsScanning(false)}
            >
              หยุดสแกน
            </Button>
          )}
        </Box>
      </Paper>

      {/* Scan Results */}
      {scanResults.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">ผลการสแกน</Typography>
            <Button variant="outlined" size="small" onClick={clearResults}>
              ล้างผลลัพธ์
            </Button>
          </Box>

          <Stack spacing={2}>
            {scanResults.map((result, index) => (
              <Card key={index} variant="outlined">
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip 
                      label={result.format} 
                      size="small" 
                      color="primary" 
                    />
                    <Typography variant="caption" color="textSecondary">
                      {result.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      wordBreak: 'break-all',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                      p: 1,
                      borderRadius: 1
                    }}
                    onClick={() => copyToClipboard(result.text)}
                    title="คลิกเพื่อคัดลอก"
                  >
                    {result.text}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Instructions */}
      <Paper sx={{ p: 2, mt: 3, backgroundColor: 'info.light' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          วิธีใช้งาน:
        </Typography>
        <Typography variant="body2" component="div">
          • กดปุ่ม "เริ่มสแกน Barcode" เพื่อเปิดกล้อง<br/>
          • นำกล้องไปส่องที่ barcode หรือ QR code<br/>
          • ระบบจะอ่านค่าอัตโนมัติและแสดงผลลัพธ์<br/>
          • คลิกที่ผลลัพธ์เพื่อคัดลอกข้อความ<br/>
          • รองรับ: QR Code, Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E
        </Typography>
      </Paper>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default BarcodeScannerPOC;
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
      
      if (!codeReader.current) {
        throw new Error('Code reader not initialized');
      }

      // ขอสิทธิ์เข้าถึงกล้องก่อน
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' }, // กล้องหลัง
          width: { ideal: 4096, max: 4096 },    // เพิ่มความละเอียดสูงสุด
          height: { ideal: 2160, max: 2160 },
          aspectRatio: { ideal: 16 / 9 }
        }
      };

      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermission(true);

      // ตั้งค่า video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // รอให้ video โหลดก่อน
        await new Promise((resolve, reject) => {
          if (!videoRef.current) return reject();
          
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            resolve(true);
          };
          
          videoRef.current.onerror = (e) => {
            console.error('Video error:', e);
            reject(e);
          };
          
          videoRef.current.play();
        });
      }

      setIsScanning(true);
      console.log('Starting continuous scan...');
      
      // ใช้ decodeFromVideoDevice แทน (ประสิทธิภาพดีกว่า)
      startZXingScan();

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

  // วิธีใหม่ที่ใช้ ZXing built-in method
  const startZXingScan = () => {
    if (!codeReader.current || !videoRef.current) return;

    // เรียก decodeFromVideoDevice แบบ continuous
    codeReader.current.decodeFromVideoDevice(
      currentDeviceId || null,
      videoRef.current,
      (result, err) => {
        if (result) {
          // ป้องกัน duplicate barcode ซ้ำ ๆ
          setScanResults(prev => {
            if (prev[0]?.text === result.getText()) return prev;
            return [{ 
              text: result.getText(), 
              format: result.getBarcodeFormat().toString(), 
              timestamp: new Date() 
            }, ...prev.slice(0, 4)];
          });
          playBeepSound();
          if ('vibrate' in navigator) navigator.vibrate(200);
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error('ZXing scan error:', err);
        }
      }
    );
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

  // เพิ่มฟังก์ชันนี้ใน component
  function cropCenterAndDraw(video: HTMLVideoElement, canvas: HTMLCanvasElement, cropRatio = 0.5) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    // cropRatio = 0.5 คือเอา 50% ตรงกลาง
    const cw = vw * cropRatio;
    const ch = vh * cropRatio;
    const sx = (vw - cw) / 2;
    const sy = (vh - ch) / 2;
    canvas.width = cw;
    canvas.height = ch;
    ctx.drawImage(video, sx, sy, cw, ch, 0, 0, cw, ch);
  }

  // ฟังก์ชันนี้ต้องอยู่ใน async function เท่านั้น
  const scanSmallBarcodeFromCanvas = () => {
    if (!videoRef.current || !canvasRef.current || !codeReader.current) return;

    cropCenterAndDraw(videoRef.current, canvasRef.current, 0.5); // 0.5 = 50% ตรงกลาง

    try {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const image = new window.Image();
      image.src = canvas.toDataURL();
      image.onload = () => {
        try {
          const result = codeReader.current!.decode(image);
          if (result) {
            setScanResults(prev => {
              if (prev[0]?.text === result.getText()) return prev;
              return [{
                text: result.getText(),
                format: result.getBarcodeFormat().toString(),
                timestamp: new Date()
              }, ...prev.slice(0, 4)];
            });
            playBeepSound();
            if ('vibrate' in navigator) navigator.vibrate(200);
          }
        } catch (e) {
          // ไม่เจอ barcode ใน frame นี้
        }
      };
    } catch (e) {
      // ไม่เจอ barcode ใน frame นี้
    }
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
              border: '2px solid #ccc' // เพิ่มเพื่อดู boundary
            }}
            playsInline
            muted
            autoPlay
            controls={false} // ปิด controls
            onLoadedMetadata={() => {
              console.log('Video loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
            }}
            onError={(e) => {
              console.error('Video error:', e);
              setError('เกิดข้อผิดพลาดกับวิดีโอ');
            }}
            onPlay={() => {
              console.log('Video started playing');
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
                width: 100,
                height: 100,
                border: '2px solid #00f',
                borderRadius: 2,
                pointerEvents: 'none'
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

      {/* Debug Info */}
      {isScanning && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" display="block">
            Camera: {devices.find(d => d.deviceId === currentDeviceId)?.label || 'Unknown'}
          </Typography>
          <Typography variant="caption" display="block">
            Video Ready: {videoRef.current?.readyState === 4 ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="caption" display="block">
            Stream Active: {stream?.active ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="caption" display="block">
            Torch Support: {(stream?.getVideoTracks()[0]?.getCapabilities() as any).torch ? 'Yes' : 'No'}
          </Typography>
        </Box>
      )}

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
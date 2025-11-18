import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Paper, Alert, Chip, Stack, Card, CardContent } from "@mui/material";
import { IconCamera, IconCameraOff } from "@tabler/icons-react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

export interface ScanResult {
  text: string;
  format: string;
  timestamp: Date;
}

interface BarcodeScannerProps {
  onScan?: (result: ScanResult) => void;
  onError?: (error: string) => void;
  showResult?: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onError, showResult = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // ✅ เพิ่ม audio ref

  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scanCooldownRef = useRef(false);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (codeReader.current) codeReader.current.reset();
      stopScanning();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isScanning) stopScanning();
    // eslint-disable-next-line
  }, [isScanning]);

  const startScanning = async () => {
    try {
      setError("");
      
      // ✅ ตรวจสอบ mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("ส่วนหนึ่งของ API ไม่ได้รับการรองรับในบริษัท");
      }

      if (!codeReader.current) throw new Error("Code reader not initialized");

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          aspectRatio: 16 / 9,
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermission(true);
      
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (!videoTrack) throw new Error("ไม่สามารถรับวิดีโอ track ได้");

      const capabilities = videoTrack.getCapabilities?.();
      if (capabilities && "zoom" in capabilities) {
        try {
          const zoom = capabilities.zoom as { max?: number; min?: number };
          if (zoom && typeof zoom.max === "number") {
            const zoomValue = Math.min(2, zoom.max);
            await videoTrack.applyConstraints({ advanced: [{ zoom: zoomValue }] } as any);
            console.log("Zoom set to", zoomValue);
          }
        } catch (e) {
          console.warn("Zoom not supported or failed:", e);
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await new Promise((resolve, reject) => {
          if (!videoRef.current) return reject(new Error("Video ref not available"));
          videoRef.current.onloadedmetadata = () => resolve(true);
          videoRef.current.onerror = (e) => reject(e);
          videoRef.current.play().catch(reject);
        });
      }

      setIsScanning(true);
      startZXingScan();
    } catch (err: any) {
      setIsScanning(false);
      setHasPermission(false);
      let msg = "เกิดข้อผิดพลาดในการเข้าถึงกล้อง";
      
      if (err?.name === "NotAllowedError") {
        msg = "กรุณาอนุญาตให้เข้าถึงกล้องเพื่อใช้งานฟีเจอร์นี้";
      } else if (err?.name === "NotFoundError") {
        msg = "ไม่พบกล้องในอุปกรณ์นี้";
      } else if (err?.name === "OverconstrainedError") {
        msg = "ไม่พบกล้องหลังในอุปกรณ์นี้ หรืออุปกรณ์ไม่รองรับการเลือกกล้องหลัง";
      } else if (err?.name === "NotReadableError") {
        msg = "กล้องถูกใช้งานโดยโปรแกรมอื่นอยู่";
      } else if (err?.message) {
        msg = err.message;
      }
      
      console.error("🚀 ~ startScanning error:", err);
      setError(msg);
      if (onError) onError(msg);
    }
  };

  const startZXingScan = () => {
    if (!codeReader.current || !videoRef.current) return;
    codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
      if (result && !scanCooldownRef.current) {
        scanCooldownRef.current = true;
        const newResult: ScanResult = {
          text: result.getText(),
          format: result.getBarcodeFormat().toString(),
          timestamp: new Date(),
        };
        setScanResults((prev) => [newResult, ...prev.slice(0, 4)]);
        if (onScan) onScan(newResult);
        playSound();
        if ("vibrate" in navigator) navigator.vibrate(200);
        setTimeout(() => {
          scanCooldownRef.current = false;
        }, 3000);
      }
      if (err && !(err instanceof NotFoundException)) {
        setError("ZXing scan error: " + err);
        if (onError) onError("ZXing scan error: " + err);
      }
    });
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (codeReader.current) codeReader.current.reset();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }
  };

   const playSound = () => {
     if (!audioRef.current) {
       audioRef.current = new Audio("/sounds/beep.wav");
       audioRef.current.volume = 0.3;
     }
     audioRef.current.currentTime = 0;
     audioRef.current.play().catch((err) => {
       console.error("🚀 ~ playSound error:", err); // ✅ เพิ่ม debug
     });
   };


  const clearResults = () => setScanResults([]);

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        Barcode Scanner
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ position: "relative", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <video
            ref={videoRef}
            style={{
              width: "100%",
              maxWidth: 500,
              height: "auto",
              backgroundColor: "#000",
              display: isScanning ? "block" : "none",
              border: "2px solid #ccc",
            }}
            playsInline
            muted
            autoPlay
            controls={false}
          />
          {isScanning && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 200,
                height: 200,
                border: "2px solid #ff0000",
                borderRadius: 2,
                pointerEvents: "none",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -1,
                  left: -1,
                  right: -1,
                  bottom: -1,
                  border: "2px solid rgba(255,255,255,0.5)",
                  borderRadius: 2,
                  animation: "pulse 2s infinite",
                },
              }}
            />
          )}
        </Box>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          {!isScanning ? (
            <Button variant="contained" size="large" startIcon={<IconCamera />} onClick={startScanning} disabled={hasPermission === false}>
              เริ่มสแกน Barcode
            </Button>
          ) : (
            <Button variant="outlined" size="large" startIcon={<IconCameraOff />} onClick={stopScanning}>
              หยุดสแกน
            </Button>
          )}
        </Box>
      </Paper>
      {showResult && scanResults.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">ผลการสแกน</Typography>
            <Button variant="outlined" size="small" onClick={clearResults}>
              ล้างผลลัพธ์
            </Button>
          </Box>
          <Stack spacing={2}>
            {scanResults.map((result, index) => (
              <Card key={index} variant="outlined">
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Chip label={result.format} size="small" color="primary" />
                    <Typography variant="caption" color="textSecondary">
                      {result.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: "break-all",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "action.hover" },
                      p: 1,
                      borderRadius: 1,
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
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
};

export default BarcodeScanner;

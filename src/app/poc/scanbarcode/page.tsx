"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Paper, Alert, Chip, Stack, IconButton, Card, CardContent } from "@mui/material";
import { IconCamera, IconCameraOff, IconBulbFilled, IconRotate, IconX, IconBulb } from "@tabler/icons-react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

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
  const [scanCooldown, setScanCooldown] = useState(false);

  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scanCooldownRef = useRef(false);

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
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      setDevices(videoDevices);

      // เลือกกล้องหลัง (rear camera) เป็นค่าเริ่มต้น
      const backCamera = videoDevices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment")
      );

      if (backCamera) {
        setCurrentDeviceId(backCamera.deviceId);
      } else if (videoDevices.length > 0) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error getting cameras:", err);
      setError("ไม่สามารถเข้าถึงกล้องได้");
    }
  };

  const startScanning = async () => {
    try {
      setError("");

      if (!codeReader.current) {
        throw new Error("Code reader not initialized");
      }

      // ขอสิทธิ์เข้าถึงกล้องหลังเท่านั้น
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { exact: "environment" }, // บังคับกล้องหลัง
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          aspectRatio: 16 / 9,
        },
      };

      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermission(true);

      // ลอง zoom กล้อง (ถ้าอุปกรณ์รองรับ)
      const videoTrack = mediaStream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();
      if ("zoom" in capabilities) {
        try {
          // ตรวจสอบว่า capabilities.zoom เป็น object ที่มี property max
          const zoom = capabilities.zoom as { max?: number; min?: number };
          if (zoom && typeof zoom.max === "number") {
            // เลือกค่ากลางระหว่าง min/max หรือกำหนดเอง เช่น 2x
            const zoomValue = Math.min(2, zoom.max);
            await videoTrack.applyConstraints({ advanced: [{ zoom: zoomValue }] } as any);
            console.log("Zoom set to", zoomValue);
          }
        } catch (e) {
          console.warn("Zoom not supported or failed:", e);
        }
      }

      // ตั้งค่า video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        // รอให้ video โหลดก่อน
        await new Promise((resolve, reject) => {
          if (!videoRef.current) return reject();

          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded");
            resolve(true);
          };

          videoRef.current.onerror = (e) => {
            console.error("Video error:", e);
            reject(e);
          };

          videoRef.current.play();
        });
      }

      setIsScanning(true);
      console.log("Starting continuous scan...");

      // ใช้ decodeFromVideoDevice แทน (ประสิทธิภาพดีกว่า)
      startZXingScan();
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      setIsScanning(false);

      if (err.name === "NotAllowedError") {
        setError("กรุณาอนุญาตให้เข้าถึงกล้องเพื่อใช้งานฟีเจอร์นี้");
        setHasPermission(false);
      } else if (err.name === "NotFoundError") {
        setError("ไม่พบกล้องในอุปกรณ์นี้");
        setHasPermission(false);
      } else {
        setError("เกิดข้อผิดพลาดในการเข้าถึงกล้อง: " + err.message);
      }
    }
  };

  // วิธีใหม่ที่ใช้ ZXing built-in method
  const startZXingScan = () => {
    if (!codeReader.current || !videoRef.current) return;

    codeReader.current.decodeFromVideoDevice(currentDeviceId || null, videoRef.current, (result, err) => {
      if (result && !scanCooldownRef.current) {
        scanCooldownRef.current = true;
        console.log("Barcode detected:", result.getText());
        const newResult: ScanResult = {
          text: result.getText(),
          format: result.getBarcodeFormat().toString(),
          timestamp: new Date(),
        };
        setScanResults((prev) => [newResult, ...prev.slice(0, 4)]);
        playBeepSound();
        if ("vibrate" in navigator) navigator.vibrate(200);

        // หน่วง 3 วินาที ก่อนจะยอมสแกนรอบถัดไป
        setTimeout(() => {
          scanCooldownRef.current = false;
        }, 3000);
      }
      if (err && !(err instanceof NotFoundException)) {
        console.error("ZXing scan error:", err);
      }
    });
  };

  const stopScanning = () => {
    setIsScanning(false);

    // หยุด code reader
    if (codeReader.current) {
      codeReader.current.reset();
    }

    // หยุด video stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
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

      if ("torch" in capabilities && (capabilities as any).torch) {
        await track.applyConstraints({
          advanced: [{ torch: !torchEnabled } as any],
        });
        setTorchEnabled(!torchEnabled);
      } else {
        setError("อุปกรณ์นี้ไม่รองรับไฟฉาย");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error toggling torch:", err);
      setError("ไม่สามารถเปิด/ปิดไฟฉายได้");
      setTimeout(() => setError(""), 3000);
    }
  };

  const switchCamera = async () => {
    if (devices.length <= 1) return;

    const currentIndex = devices.findIndex((device) => device.deviceId === currentDeviceId);
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
    oscillator.type = "square";

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
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Barcode Scanner POC
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Scanner Interface */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ position: "relative", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* Video Element */}
          <video
            ref={videoRef}
            style={{
              width: "100%",
              maxWidth: 500,
              height: "auto",
              backgroundColor: "#000",
              display: isScanning ? "block" : "none",
              border: "2px solid #ccc", // เพิ่มเพื่อดู boundary
            }}
            playsInline
            muted
            autoPlay
            controls={false} // ปิด controls
            onLoadedMetadata={() => {
              console.log("Video loaded, dimensions:", videoRef.current?.videoWidth, "x", videoRef.current?.videoHeight);
            }}
            onError={(e) => {
              console.error("Video error:", e);
              setError("เกิดข้อผิดพลาดกับวิดีโอ");
            }}
            onPlay={() => {
              console.log("Video started playing");
            }}
          />

          {/* Hidden Canvas for processing */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Scanner Overlay */}
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

          {/* Control Buttons */}
          {/* {isScanning && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(0,0,0,0.7)",
                borderRadius: 2,
                p: 1,
              }}
            >
              <IconButton onClick={toggleTorch} sx={{ color: torchEnabled ? "yellow" : "white" }}>
                {torchEnabled ? <IconBulbFilled /> : <IconBulb />}
              </IconButton>

              <IconButton onClick={switchCamera} sx={{ color: "white" }} disabled={devices.length <= 1}>
                <IconRotate />
              </IconButton>

              <IconButton onClick={stopScanning} sx={{ color: "white" }}>
                <IconX />
              </IconButton>
            </Stack>
          )} */}
        </Box>

        {/* Start/Stop Button */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          {!isScanning ? (
            <Button variant="contained" size="large" startIcon={<IconCamera />} onClick={startScanning} disabled={hasPermission === false}>
              เริ่มสแกน Barcode
            </Button>
          ) : (
            <Button variant="outlined" size="large" startIcon={<IconCameraOff />} onClick={() => setIsScanning(false)}>
              หยุดสแกน
            </Button>
          )}
        </Box>
      </Paper>

      {/* Scan Results */}
      {scanResults.length > 0 && (
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

      {/* Instructions */}
      <Paper sx={{ p: 2, mt: 3, backgroundColor: "info.light" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          วิธีใช้งาน:
        </Typography>
        <Typography variant="body2" component="div">
          • กดปุ่ม "เริ่มสแกน Barcode" เพื่อเปิดกล้อง
          <br />
          • นำกล้องไปส่องที่ barcode หรือ QR code
          <br />
          • ระบบจะอ่านค่าอัตโนมัติและแสดงผลลัพธ์
          <br />
          • คลิกที่ผลลัพธ์เพื่อคัดลอกข้อความ
          <br />• รองรับ: QR Code, Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E
        </Typography>
      </Paper>

      {/* Debug Info */}
      {isScanning && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: "grey.100", borderRadius: 1 }}>
          <Typography variant="caption" display="block">
            Camera: {devices.find((d) => d.deviceId === currentDeviceId)?.label || "Unknown"}
          </Typography>
          <Typography variant="caption" display="block">
            Video Ready: {videoRef.current?.readyState === 4 ? "Yes" : "No"}
          </Typography>
          <Typography variant="caption" display="block">
            Stream Active: {stream?.active ? "Yes" : "No"}
          </Typography>
          <Typography variant="caption" display="block">
            Torch Support: {(stream?.getVideoTracks()[0]?.getCapabilities() as any).torch ? "Yes" : "No"}
          </Typography>
        </Box>
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

export default BarcodeScannerPOC;

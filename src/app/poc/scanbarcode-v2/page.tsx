"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Paper, Typography, Stack, IconButton, Alert, Card, CardContent, Chip } from "@mui/material";
import { IconCamera, IconCameraOff, IconCameraRotate, IconX } from "@tabler/icons-react";
import Quagga from "@ericblade/quagga2";

interface ScanResult {
  code: string;
  format: string;
  timestamp: Date;
}

const BarcodeScannerQuagga = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string>("");
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCamera, setCurrentCamera] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  // ค้นหากล้อง
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoDevices = devices.filter(d => d.kind === "videoinput");
      setCameras(videoDevices);
      if (videoDevices.length > 0) setCurrentCamera(videoDevices[0].deviceId);
    });
  }, []);

  // เริ่ม/หยุด Quagga
  useEffect(() => {
    if (!isScanning || !currentCamera) return;

    Quagga.init({
      inputStream: {
        type: "LiveStream",
        target: scannerRef.current!,
        constraints: {
          deviceId: currentCamera,
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      },
      decoder: {
        readers: [
          "ean_reader",
          "ean_8_reader",
          "code_128_reader",
          "code_39_reader",
          "upc_reader",
          "upc_e_reader"
        ]
      },
      locate: true,
      locator: { patchSize: "medium", halfSample: true }
    }, err => {
      if (err) {
        setError("ไม่สามารถเริ่มกล้องได้: " + err.message);
        setIsScanning(false);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected(onDetected);

    return () => {
      Quagga.offDetected(onDetected);
      Quagga.stop();
    };
    // eslint-disable-next-line
  }, [isScanning, currentCamera]);

  const onDetected = (result: any) => {
    if (!result || !result.codeResult || !result.codeResult.code) return;
    setScanResults(prev => {
      if (prev[0]?.code === result.codeResult.code) return prev;
      return [{
        code: result.codeResult.code,
        format: result.codeResult.format,
        timestamp: new Date()
      }, ...prev.slice(0, 4)];
    });
    playBeepSound();
    if ("vibrate" in navigator) navigator.vibrate(200);
  };

  const playBeepSound = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = "square";
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  };

  const switchCamera = () => {
    if (cameras.length <= 1) return;
    const idx = cameras.findIndex(c => c.deviceId === currentCamera);
    const next = cameras[(idx + 1) % cameras.length];
    setCurrentCamera(next.deviceId);
  };

  const clearResults = () => setScanResults([]);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Barcode Scanner (Quagga2)
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ position: "relative", width: "100vw", height: "60vw", maxHeight: 480, overflow: "hidden", mx: "auto" }}>
          <div ref={scannerRef} style={{ width: "100%", height: "100%" }} />
          {isScanning && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 100,
                height: 100,
                border: "2px solid #00f",
                borderRadius: 2,
                pointerEvents: "none"
              }}
            />
          )}
          {isScanning && (
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
                p: 1
              }}
            >
              <IconButton onClick={switchCamera} sx={{ color: "white" }} disabled={cameras.length <= 1}>
                <IconCameraRotate />
              </IconButton>
              <IconButton onClick={() => setIsScanning(false)} sx={{ color: "white" }}>
                <IconX />
              </IconButton>
            </Stack>
          )}
        </Box>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          {!isScanning ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<IconCamera />}
              onClick={() => setIsScanning(true)}
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

      {scanResults.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">ผลการสแกน</Typography>
            <Button variant="outlined" size="small" onClick={clearResults}>
              ล้างผลลัพธ์
            </Button>
          </Box>
          <Stack spacing={2}>
            {scanResults.map((result, idx) => (
              <Card key={idx} variant="outlined">
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
                      borderRadius: 1
                    }}
                    title="คลิกเพื่อคัดลอก"
                    onClick={() => navigator.clipboard.writeText(result.code)}
                  >
                    {result.code}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>
      )}

      <Paper sx={{ p: 2, mt: 3, backgroundColor: "info.light" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          วิธีใช้งาน:
        </Typography>
        <Typography variant="body2" component="div">
          • กดปุ่ม "เริ่มสแกน Barcode" เพื่อเปิดกล้อง<br />
          • นำกล้องไปส่องที่ barcode (รองรับ EAN, Code128, Code39, UPC)<br />
          • ระบบจะอ่านค่าอัตโนมัติและแสดงผลลัพธ์<br />
          • คลิกที่ผลลัพธ์เพื่อคัดลอกข้อความ
        </Typography>
      </Paper>
    </Box>
  );
};

export default BarcodeScannerQuagga;
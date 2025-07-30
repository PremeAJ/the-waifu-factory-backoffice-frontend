'use client';

import React, { useState, useEffect } from 'react';

// Interface สำหรับ event `beforeinstallprompt`
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

const AddToHomeScreen = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const isDeviceIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIos(isDeviceIos);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true); // แสดง Popup เมื่อพร้อมติดตั้ง (สำหรับ Android/Desktop)
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (isDeviceIos && !isStandalone()) {
        setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // ตรวจสอบว่าแอปถูกเปิดในโหมด Standalone (PWA) หรือไม่
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismissClick = () => {
    setShowBanner(false);
  };

  if (!showBanner || isStandalone()) {
    return null;
  }

  // --- CSS Styles ---
  const bannerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    textAlign: 'center',
    maxWidth: '90%',
    width: '350px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    margin: '0 5px',
  };

  const confirmButtonStyle = { ...buttonStyle, backgroundColor: '#007bff', color: 'white' };
  const dismissButtonStyle = { ...buttonStyle, backgroundColor: '#f0f0f0', color: 'black' };

  // --- Render Logic ---
  if (isIos) {
    return (
      <div style={bannerStyle}>
        <h4>ติดตั้งแอปพลิเคชัน</h4>
        <p>แตะที่ปุ่ม "แชร์" <img src="https://img.icons8.com/ios/20/000000/share-rounded.png" alt="share icon" style={{verticalAlign: 'middle'}}/> แล้วเลือก "เพิ่มไปยังหน้าจอโฮม"</p>
        <button style={dismissButtonStyle} onClick={handleDismissClick}>ปิด</button>
      </div>
    );
  }

  return (
    <div style={bannerStyle}>
      <h4>เพิ่มไปยังหน้าจอโฮม</h4>
      <p>ติดตั้งแอปพลิเคชันนี้บนอุปกรณ์ของคุณเพื่อการเข้าถึงที่รวดเร็ว</p>
      <div style={{ marginTop: '15px' }}>
        <button style={confirmButtonStyle} onClick={handleInstallClick}>ยืนยัน</button>
        <button style={dismissButtonStyle} onClick={handleDismissClick}>ปฏิเสธ</button>
      </div>
    </div>
  );
};

export default AddToHomeScreen;
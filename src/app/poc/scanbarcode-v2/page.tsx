'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader()
    let scannerControls: { stop: () => void } | null = null

    BrowserMultiFormatReader
      .listVideoInputDevices()
      .then(videoInputDevices => {
        if (videoInputDevices.length === 0) {
          setError('No camera found')
          return
        }

        const selectedDeviceId = videoInputDevices[0].deviceId

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, error, _) => {
            if (result) {
              setResult(result.getText())
              if (scannerControls) scannerControls.stop() // stop after first scan
            }

            if (error) {
              console.log('Scanning error:', error.message)
            }
          }
        ).then(controls => {
          scannerControls = controls
        })
      })
      .catch(err => setError(err.message))

    return () => {
      if (scannerControls) scannerControls.stop()
    }
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📷 สแกนบาร์โค้ด</h1>
      <video ref={videoRef} className="w-full max-w-md border rounded shadow" />
      {result && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ พบข้อมูลบาร์โค้ด: <strong>{result}</strong>
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          ⚠️ เกิดข้อผิดพลาด: {error}
        </div>
      )}
    </div>
  )
}

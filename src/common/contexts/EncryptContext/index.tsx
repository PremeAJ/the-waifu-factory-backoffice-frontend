"use client";
import React, { createContext, useContext } from "react";
import CryptoJS from "crypto-js";

export interface EncryptContextType {
  encrypt: (text: string) => string;
  decrypt: (encrypted: string) => string | void;
}

export const EncryptContext = createContext<EncryptContextType>({} as EncryptContextType);

export const EncryptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const encrypt = (text: string) => {
    if (!text) return "";
    const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";
    const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex); 
    const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Hex.parse(encryptionKey), {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).ciphertext.toString(CryptoJS.enc.Hex);
    return encrypted + iv;
  };

  const decrypt = (encrypted: string) => {
      if (!encrypted) return "";
      const ivHexLength = 32; 
      const encryptedHex = encrypted.slice(0, -ivHexLength);
      const iv = encrypted.slice(-ivHexLength);
      const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(encryptedHex),
      });
      const decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Hex.parse(encryptionKey), {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
  };

  const value: EncryptContextType = { encrypt, decrypt };

  return <EncryptContext.Provider value={value}>{children}</EncryptContext.Provider>;
};

export const useEncrypt = () => useContext(EncryptContext);

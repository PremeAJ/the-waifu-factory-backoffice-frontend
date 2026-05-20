"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Types matching API schemas ────────────────────────────────────────────────

export interface SocialMediaMaster {
  id: string;
  name: string;    // e.g. "X (Twitter)"
  iconUrl: string; // e.g. "https://cdn.simpleicons.org/x"
}

export interface PaymentMethodMaster {
  id: string;
  name: string;    // e.g. "PromptPay"
  iconUrl: string; // e.g. "https://cdn.simpleicons.org/promptpay"
}

export interface AdoptableTagItem {
  id: string;
  name: string;         // e.g. "Human"
  color: string | null; // e.g. "#FFB3B3"
}

export interface AdoptableTagCategory {
  id: string;
  name: string;         // e.g. "Species"
  color: string | null; // e.g. "#FF6B6B"
  tags: AdoptableTagItem[];
}

export interface ArtistMaster {
  id: string;
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
}

// ── Context type ──────────────────────────────────────────────────────────────

export interface MasterDataContextType {
  socialMedias: SocialMediaMaster[];
  paymentMethods: PaymentMethodMaster[];
  adoptableTags: AdoptableTagCategory[];
  artists: ArtistMaster[];
  isLoading: boolean;
}

// ── Context ───────────────────────────────────────────────────────────────────

export const MasterDataContext = createContext<MasterDataContextType>({
  socialMedias: [],
  paymentMethods: [],
  adoptableTags: [],
  artists: [],
  isLoading: false,
});

// ── Provider ──────────────────────────────────────────────────────────────────

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socialMedias, setSocialMedias] = useState<SocialMediaMaster[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodMaster[]>([]);
  const [adoptableTags, setAdoptableTags] = useState<AdoptableTagCategory[]>([]);
  const [artists, setArtists] = useState<ArtistMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const ngrokHeaders = { "ngrok-skip-browser-warning": "true" };
        const [smRes, pmRes, tagRes, artistRes] = await Promise.all([
          fetch(`${API_URL}/master/social-media`, { headers: ngrokHeaders }),
          fetch(`${API_URL}/master/payment-method`, { headers: ngrokHeaders }),
          fetch(`${API_URL}/master/adoptable-tags`, { headers: ngrokHeaders }),
          fetch(`${API_URL}/master/artist-list`, { headers: ngrokHeaders }),
        ]);
        if (smRes.ok) { const j = await smRes.json(); setSocialMedias(j?.data ?? j); }
        if (pmRes.ok) { const j = await pmRes.json(); setPaymentMethods(j?.data ?? j); }
        if (tagRes.ok) { const j = await tagRes.json(); setAdoptableTags(j?.data ?? j); }
        if (artistRes.ok) { const j = await artistRes.json(); setArtists(j?.data ?? j); }
      } catch {
        // master data is optional — silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <MasterDataContext.Provider value={{ socialMedias, paymentMethods, adoptableTags, artists, isLoading }}>
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => useContext(MasterDataContext);

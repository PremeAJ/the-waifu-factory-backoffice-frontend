"use client";
import React, { createContext, useContext, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Types matching API schemas ────────────────────────────────────────────────

export type AdoptableStatus = "open" | "close" | "resell";

export interface Adoptable {
  id: string;
  artistId: string;
  ownerId: string;
  number: number;
  imageUrl: string;
  externalUrl?: string;
  status: AdoptableStatus;
  price?: number;
  tagNames?: string[];
}

export interface CreateAdoptableDto {
  artistId: string;
  ownerId?: string; // defaults to artistId if not provided
  number: number;
  imageUrl: string;
  externalUrl?: string;
  status?: AdoptableStatus; // defaults to "open"
  price?: number;
  tagNames?: string[];
}

export interface UpdateAdoptableDto {
  imageUrl?: string;
  externalUrl?: string;
  ownerId?: string;
  status?: AdoptableStatus;
  price?: number;
  tagNames?: string[];
}

// ── Context type ──────────────────────────────────────────────────────────────

export interface AdoptableContextType {
  adoptables: Adoptable[];
  myAdoptables: Adoptable[];
  isLoading: boolean;
  fetchAll: () => Promise<void>;
  fetchMine: () => Promise<void>;
  fetchOne: (id: string) => Promise<Adoptable>;
  create: (dto: CreateAdoptableDto) => Promise<Adoptable>;
  update: (id: string, dto: UpdateAdoptableDto) => Promise<Adoptable>;
  remove: (id: string) => Promise<void>;
  uploadImage: (artistId: string, number: number, file: File) => Promise<string>;
}

// ── Context ───────────────────────────────────────────────────────────────────

export const AdoptableContext = createContext<AdoptableContextType>({} as AdoptableContextType);

// ── Provider ──────────────────────────────────────────────────────────────────

export const AdoptableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adoptables, setAdoptables] = useState<Adoptable[]>([]);
  const [myAdoptables, setMyAdoptables] = useState<Adoptable[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const authFetch = (path: string, options: RequestInit = {}) =>
    fetch(`${API_URL}${path}`, { ...options, credentials: "include" });

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch("/adoptable");
      if (res.ok) setAdoptables(await res.json());
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMine = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch("/adoptable/me");
      if (res.ok) setMyAdoptables(await res.json());
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOne = async (id: string): Promise<Adoptable> => {
    const res = await authFetch(`/adoptable/${id}`);
    return res.json();
  };

  const create = async (dto: CreateAdoptableDto): Promise<Adoptable> => {
    const res = await authFetch("/adoptable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return res.json();
  };

  const update = async (id: string, dto: UpdateAdoptableDto): Promise<Adoptable> => {
    const res = await authFetch(`/adoptable/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return res.json();
  };

  const remove = async (id: string): Promise<void> => {
    await authFetch(`/adoptable/${id}`, { method: "DELETE" });
  };

  const uploadImage = async (artistId: string, number: number, file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    const res = await authFetch(`/adoptable/upload/${artistId}/${number}`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    return data?.url ?? data;
  };

  return (
    <AdoptableContext.Provider
      value={{ adoptables, myAdoptables, isLoading, fetchAll, fetchMine, fetchOne, create, update, remove, uploadImage }}
    >
      {children}
    </AdoptableContext.Provider>
  );
};

export const useAdoptable = () => useContext(AdoptableContext);

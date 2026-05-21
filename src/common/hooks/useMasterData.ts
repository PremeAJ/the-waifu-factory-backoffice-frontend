import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";

const SWR_OPTIONS = { revalidateOnFocus: false };

export interface SocialMediaMaster {
  id: string;
  name: string;
  iconUrl: string;
}

export interface PaymentMethodMaster {
  id: string;
  name: string;
  iconUrl: string;
}

export interface AdoptableTagItem {
  id: string;
  name: string;
  color: string | null;
}

export interface AdoptableTagCategory {
  id: string;
  name: string;
  color: string | null;
  tags: AdoptableTagItem[];
}

export interface ArtistMaster {
  id: string;
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
}

export const useArtists = () => {
  const { data, isLoading, error } = useSWR("/api/master/artist-list", getFetcher, SWR_OPTIONS);
  return { artists: (data?.data ?? []) as ArtistMaster[], isLoading, error };
};

export const useAdoptableTags = () => {
  const { data, isLoading, error } = useSWR("/api/master/adoptable-tags", getFetcher, SWR_OPTIONS);
  return { adoptableTags: (data?.data ?? []) as AdoptableTagCategory[], isLoading, error };
};

export const usePaymentMethods = () => {
  const { data, isLoading, error } = useSWR("/api/master/payment-method", getFetcher, SWR_OPTIONS);
  return { paymentMethods: (data?.data ?? []) as PaymentMethodMaster[], isLoading, error };
};

export const useSocialMedias = () => {
  const { data, isLoading, error } = useSWR("/api/master/social-media", getFetcher, SWR_OPTIONS);
  return { socialMedias: (data?.data ?? []) as SocialMediaMaster[], isLoading, error };
};

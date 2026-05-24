import useSWR from "swr";

// ---- Types ----

export interface UserPaymentMethod {
  name: string;
  iconUrl: string;
  accountValue: string;
}

export interface UserSocialMedia {
  name: string;
  iconUrl: string;
  url: string;
}

export interface WaifuUser {
  id: string;
  discordId: string;
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
  bannerUrl: string | null;
  accentColor: string | null;
  createdAt: string;
  paymentMethods: UserPaymentMethod[];
  socialMedias: UserSocialMedia[];
}

// ---- Hook ----

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Fetcher that treats 401 as "not logged in" instead of redirecting to sign-in */
const authFetcher = async (_url: string) => {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    credentials: "include",
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
};

export const useCurrentUser = () => {
  const { data, isLoading, mutate } = useSWR<{ isSuccess: boolean; data: WaifuUser } | null>(
    "/api/auth/me",
    authFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const signOut = async () => {
    await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
    await mutate(null);
  };

  return {
    user: data?.data ?? null,
    isLoading,
    refetch: () => mutate(),
    signOut,
  };
};

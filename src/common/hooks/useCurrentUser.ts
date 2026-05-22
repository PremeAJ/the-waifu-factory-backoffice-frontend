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

/** Fetcher that treats 401 as "not logged in" instead of redirecting to sign-in */
const authFetcher = async (url: string) => {
  const res = await fetch(url);
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
    await fetch("/api/auth/logout", { method: "POST" });
    await mutate(null);
  };

  return {
    user: data?.data ?? null,
    isLoading,
    refetch: () => mutate(),
    signOut,
  };
};

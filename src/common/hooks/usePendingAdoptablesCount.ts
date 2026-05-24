import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";

export const usePendingAdoptablesCount = () => {
  const { data } = useSWR<{ isSuccess: boolean; data: { count: number } }>(
    "/api/adoptable/pending-count",
    getFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
  return data?.data?.count ?? 0;
};

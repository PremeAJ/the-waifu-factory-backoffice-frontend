"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWaifuUser } from "@/common/contexts/WaifuUserContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { PageUrl } from "@/common/constants/pageUrl";

export default function ProfileRedirectPage() {
  const { user, isLoading } = useWaifuUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace(`/profile/${user.username}`);
    } else {
      router.replace(PageUrl.AUTH_SIGN_IN);
    }
  }, [user, isLoading, router]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}

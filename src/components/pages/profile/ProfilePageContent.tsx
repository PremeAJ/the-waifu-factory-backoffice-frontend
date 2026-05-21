"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import ChildCard from "@/components/shared/ChildCard";
import ProfileBanner from "@/components/apps/userprofile/profile/ProfileBanner";
import IntroCard from "@/components/apps/userprofile/profile/IntroCard";
import PhotosCard from "@/components/apps/userprofile/profile/PhotosCard";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import {
  IconBrandDiscord,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandYoutube,
  IconBrandTwitch,
  IconLink,
  IconPencil,
} from "@tabler/icons-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  discord: <IconBrandDiscord size={20} />,
  twitter: <IconBrandTwitter size={20} />,
  instagram: <IconBrandInstagram size={20} />,
  facebook: <IconBrandFacebook size={20} />,
  youtube: <IconBrandYoutube size={20} />,
  twitch: <IconBrandTwitch size={20} />,
};

const getSocialIcon = (name: string) =>
  SOCIAL_ICONS[name.toLowerCase()] ?? <IconLink size={20} />;

interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
  bannerUrl: string | null;
  accentColor: string | null;
  createdAt: string;
  paymentMethods: { name: string; iconUrl: string; accountValue: string }[];
  socialMedias: { name: string; iconUrl: string; url: string }[];
}

const ProfilePageContent = ({ username }: { username: string }) => {
  const { user: currentUser } = useCurrentUser();
  const router = useRouter();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [notFound, setNotFound] = useState(false);

  const isOwnProfile = !!currentUser && currentUser.username === username;

  useEffect(() => {
    // If viewing own profile, use data from auth context directly
    if (isOwnProfile && currentUser) {
      setProfile({
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        profilePictureUrl: currentUser.profilePictureUrl,
        bannerUrl: currentUser.bannerUrl,
        accentColor: currentUser.accentColor,
        createdAt: currentUser.createdAt,
        paymentMethods: currentUser.paymentMethods,
        socialMedias: currentUser.socialMedias,
      });
      return;
    }

    // Fetch public profile for other users
    fetch(`${API_URL}/user/${username}`, {
      headers: { "ngrok-skip-browser-warning": "true" },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        return res.json();
      })
      .then((json) => {
        if (!json) return;
        const data: PublicProfile = json?.data ?? json;
        setProfile(data);
      })
      .catch(() => setNotFound(true));
  }, [username, isOwnProfile, currentUser]);

  if (notFound) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box textAlign="center">
          <Typography variant="h3" mb={1}>User not found</Typography>
          <Typography color="text.secondary" mb={3}>@{username} doesn&apos;t exist.</Typography>
          <Button variant="outlined" onClick={() => router.push("/")}>Go Home</Button>
        </Box>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Banner — full width */}
          <Grid size={{ xs: 12 }}>
            <ProfileBanner
              profileUser={{
                username: profile.username,
                displayName: profile.displayName,
                profilePictureUrl: profile.profilePictureUrl,
                bannerUrl: profile.bannerUrl,
                accentColor: profile.accentColor,
              }}
            />
          </Grid>

          {/* Left column: Intro + Social + Photos */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <IntroCard />

            {/* Social media links */}
            {profile.socialMedias.length > 0 && (
              <ChildCard>
                <Typography fontWeight={600} variant="h4" mb={2}>
                  Social Links
                </Typography>
                <Stack spacing={2}>
                  {profile.socialMedias.map((sm, idx) => (
                    <Stack key={idx} direction="row" alignItems="center" gap={1.5}>
                      <Box color="text.secondary">{getSocialIcon(sm.name)}</Box>
                      <Link
                        href={sm.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        variant="h6"
                        sx={{ wordBreak: "break-all" }}
                      >
                        {sm.name}
                      </Link>
                    </Stack>
                  ))}
                </Stack>
              </ChildCard>
            )}

            <PhotosCard />
          </Grid>

          {/* Right column: About */}
          <Grid size={{ xs: 12, md: 8 }}>
            <ChildCard>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Typography fontWeight={600} variant="h4">
                  About
                </Typography>
                {isOwnProfile && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<IconPencil size={16} />}
                    onClick={() => router.push("/setting")}
                  >
                    Edit Profile
                  </Button>
                )}
              </Stack>

              <Stack direction="row" alignItems="center" gap={2} mb={3}>
                <Avatar
                  src={profile.profilePictureUrl ?? undefined}
                  sx={{ width: 72, height: 72 }}
                />
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {profile.displayName}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1">
                    @{profile.username}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" mt={0.5}>
                    Member since{" "}
                    {new Date(profile.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                    })}
                  </Typography>
                </Box>
              </Stack>

              {/* Payment methods */}
              {profile.paymentMethods.length > 0 && (
                <Box mt={2}>
                  <Typography fontWeight={600} variant="h6" mb={1}>
                    Payment Methods Accepted
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {profile.paymentMethods.map((pm, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          fontSize: 13,
                        }}
                      >
                        {pm.name}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </ChildCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePageContent;


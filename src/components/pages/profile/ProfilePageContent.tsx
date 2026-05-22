"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { deleteFetcher, getFetcher, postFetcher } from "@/app/api/globalFetcher";
import { useCurrentUser } from "@/common/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import {
  IconBrandDiscord,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandYoutube,
  IconBrandTwitch,
  IconLink,
  IconPencil,
  IconUserCheck,
  IconUserMinus,
  IconUserPlus,
} from "@tabler/icons-react";
import GalleryTab from "./GalleryTab";
import CommissionTab from "./CommissionTab";
import UserListTab from "./UserListTab";
import AdoptableTab from "./AdoptableTab";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
  bannerUrl: string | null;
  accentColor: string | null;
  createdAt: string;
  joinedAt: string;
  followerCount:  number;
  followingCount: number;
  isFollowing:    boolean;
  paymentMethods: { name: string; iconUrl: string; accountValue: string }[];
  socialMedias:   { name: string; iconUrl: string; url: string }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const SOCIAL_ICON_MAP: Record<string, React.ReactNode> = {
  discord:   <IconBrandDiscord  size={17} />,
  twitter:   <IconBrandTwitter  size={17} />,
  x:         <IconBrandTwitter  size={17} />,
  instagram: <IconBrandInstagram size={17} />,
  facebook:  <IconBrandFacebook  size={17} />,
  youtube:   <IconBrandYoutube   size={17} />,
  twitch:    <IconBrandTwitch    size={17} />,
};

const SocialIcon = ({ sm }: { sm: { name: string; iconUrl: string } }) => {
  if (sm.iconUrl) {
    return <Box component="img" src={sm.iconUrl} alt={sm.name} sx={{ width: 17, height: 17, objectFit: "contain" }} />;
  }
  return <>{SOCIAL_ICON_MAP[sm.name.toLowerCase()] ?? <IconLink size={17} />}</>;
};

// ── Tabs ───────────────────────────────────────────────────────────────────────

const TABS = ["Gallery", "Adoptable", "Commission", "Followers", "Following"] as const;
type TabKey = (typeof TABS)[number];

// ── Stat chip ─────────────────────────────────────────────────────────────────

const Stat = ({
  value,
  label,
  onClick,
}: {
  value: number | string;
  label: string;
  onClick?: () => void;
}) => (
  <Box
    textAlign="center"
    onClick={onClick}
    sx={{ cursor: onClick ? "pointer" : "default", "&:hover": onClick ? { opacity: 0.75 } : {} }}
  >
    <Typography fontWeight={800} variant="h5" lineHeight={1.1}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.6}>
      {label}
    </Typography>
  </Box>
);

// ── Main component ─────────────────────────────────────────────────────────────

const ProfilePageContent = ({ username }: { username: string }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user: currentUser } = useCurrentUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("Gallery");

  const isOwnProfile = !!currentUser && currentUser.username === username;

  const { data, isLoading } = useSWR(`/api/user/${username}`, getFetcher, {
    revalidateOnFocus: false,
  });

  const profile = data?.data as PublicProfile | undefined;
  const notFound = !isLoading && data && (data.statusCode === 404 || !data.data);

  const [following,      setFollowing]      = useState(false);
  const [followerCount,  setFollowerCount]  = useState(0);
  const [followLoading,  setFollowLoading]  = useState(false);

  useEffect(() => {
    if (profile) {
      setFollowing(profile.isFollowing ?? false);
      setFollowerCount(profile.followerCount ?? 0);
    }
  }, [profile?.id]);

  const handleFollow = async () => {
    if (followLoading) return;
    setFollowLoading(true);
    const next = !following;
    setFollowing(next);
    setFollowerCount((c) => c + (next ? 1 : -1));
    try {
      if (next) await postFetcher(`/api/user/${username}/follow`, {});
      else      await deleteFetcher(`/api/user/${username}/follow`, {});
    } catch {
      setFollowing(!next);
      setFollowerCount((c) => c + (next ? -1 : 1));
    } finally {
      setFollowLoading(false);
    }
  };

  // ── Derived values ────────────────────────────────────────────────────────

  const accent = profile?.accentColor ?? theme.palette.primary.main;
  const bannerSx = profile?.bannerUrl
    ? { backgroundImage: `url(${profile.bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: `linear-gradient(135deg, ${alpha(accent, 0.7)} 0%, ${alpha(accent, 0.25)} 100%)` };

  // ── Not found ─────────────────────────────────────────────────────────────

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

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isLoading || !profile) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const memberSince = new Date(profile.joinedAt ?? profile.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>

      {/* ── Banner ── */}
      <Box sx={{ width: "100%", height: { xs: 180, md: 260 }, position: "relative", ...bannerSx }}>
        {/* subtle dark vignette so text is readable */}
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%)" }} />

        {isOwnProfile && (
          <Button
            size="small"
            startIcon={<IconPencil size={14} />}
            onClick={() => router.push("/setting")}
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 2,
              textTransform: "none",
              fontWeight: 600,
              color: "#fff",
              bgcolor: alpha("#000", 0.28),
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.25)",
              "&:hover": { bgcolor: alpha("#000", 0.45) },
            }}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      <Container maxWidth="lg">

        {/* ── Profile header ── */}
        <Box sx={{ pb: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>

          {/* Avatar row */}
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "flex-end" }} justifyContent="space-between" gap={2}>

            <Stack direction="row" alignItems="flex-end" gap={2}>
              <Avatar
                src={profile.profilePictureUrl ?? undefined}
                sx={{
                  width: { xs: 80, md: 110 },
                  height: { xs: 80, md: 110 },
                  border: `4px solid ${theme.palette.background.paper}`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
                  mt: { xs: -5, md: -7 },
                  fontSize: { xs: 32, md: 44 },
                  flexShrink: 0,
                }}
              >
                {profile.displayName[0]}
              </Avatar>

              <Box pb={0.5}>
                <Typography variant="h4" fontWeight={800} lineHeight={1.15}>
                  {profile.displayName}
                </Typography>
                <Typography color="text.secondary" variant="body2" mt={0.3}>
                  @{profile.username} · Joined {memberSince}
                </Typography>
              </Box>
            </Stack>

            {/* Stats */}
            <Stack direction="row" spacing={4} pb={0.5} flexShrink={0}>
              <Stat value={followerCount} label="Followers" onClick={() => setActiveTab("Followers")} />
              <Stat value={profile.followingCount ?? 0} label="Following" onClick={() => setActiveTab("Following")} />
            </Stack>
          </Stack>

          {/* Social + Payment + Follow button */}
          <Stack direction="row" alignItems="center" gap={1} mt={2} flexWrap="wrap">

            {/* Social media */}
            {profile.socialMedias.map((sm, i) => (
              <Tooltip key={i} title={sm.name} placement="top" arrow>
                <IconButton
                  component="a"
                  href={sm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: isDark ? alpha("#fff", 0.06) : alpha("#000", 0.05),
                    "&:hover": { bgcolor: isDark ? alpha("#fff", 0.12) : alpha("#000", 0.1) },
                  }}
                >
                  <SocialIcon sm={sm} />
                </IconButton>
              </Tooltip>
            ))}

            {profile.socialMedias.length > 0 && profile.paymentMethods.length > 0 && (
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
            )}

            {/* Payment methods */}
            {profile.paymentMethods.map((pm, i) => (
              <Tooltip key={i} title={`${pm.name}: ${pm.accountValue}`} placement="top" arrow>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: isDark ? alpha("#fff", 0.04) : alpha("#000", 0.03),
                    cursor: "default",
                    height: 34,
                  }}
                >
                  <Box
                    component="img"
                    src={pm.iconUrl}
                    alt={pm.name}
                    sx={{ height: 18, width: "auto", objectFit: "contain", display: "block" }}
                  />
                </Box>
              </Tooltip>
            ))}

            {/* Follow button (non-own profiles) */}
            {!isOwnProfile && (
              <Button
                variant={following ? "outlined" : "contained"}
                color={following ? "error" : "primary"}
                size="small"
                startIcon={following ? <IconUserMinus size={15} /> : <IconUserPlus size={15} />}
                onClick={handleFollow}
                disabled={followLoading}
                sx={{ ml: "auto", textTransform: "none", fontWeight: 700, borderRadius: 2, minWidth: 110 }}
              >
                {following ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Stack>
        </Box>

        {/* ── Tabs ── */}
        <Tabs
          value={activeTab}
          onChange={(_, v: TabKey) => setActiveTab(v)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          {TABS.map((t) => (
            <Tab
              key={t}
              value={t}
              label={t}
              sx={{ textTransform: "none", fontWeight: 600, fontSize: 14, minWidth: 90 }}
            />
          ))}
        </Tabs>

        {/* ── Tab content ── */}
        <Box sx={{ mt: 4 }}>
          {activeTab === "Gallery"    && <GalleryTab username={username} />}
          {activeTab === "Adoptable"  && <AdoptableTab username={username} />}
          {activeTab === "Commission" && <CommissionTab username={username} />}
          {activeTab === "Followers" && <UserListTab username={username} type="followers" />}
          {activeTab === "Following" && <UserListTab username={username} type="following" />}
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePageContent;

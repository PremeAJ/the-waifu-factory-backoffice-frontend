"use client";
import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { UserDataContext } from "@/context/UserDataContext/index";
import { IconDotsVertical, IconSearch, IconPlus } from "@tabler/icons-react";
import { format } from "date-fns";

import BlankCard from "@/components/shared/BlankCard";
import { GallaryType } from "@/common/utils/types/apps/users";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";

const MyCompanyCard = () => {
  const { user } = useContext(UserContext)
  const { gallery } = useContext(UserDataContext);
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const filterPhotos = (photos: GallaryType[], cSearch: string) => {
    if (photos) return photos.filter((t) => t.name.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase()));
    return photos;
  };
  const getPhotos = filterPhotos(gallery, search);
  const [isLoading, setLoading] = React.useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const onClickAddCompany = () => {
    router.push("/dashboard/create-company");
  }

  return (
    <>
      <Grid container spacing={3} sx={{ pb: 4 }}>
        <Grid
          size={{
            sm: 12,
            lg: 12,
          }}
        >
          <Stack direction="row" alignItems={"center"} mt={2}>
            <Box>
              <Typography variant="h3">
                Company &nbsp;
                <Chip label={getPhotos.length} color="secondary" size="small" />
              </Typography>
            </Box>
            <Box ml="auto">
              <TextField
                id="outlined-search"
                placeholder="Search Gallery"
                size="small"
                type="search"
                variant="outlined"
                fullWidth
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch size="14" />
                      </InputAdornment>
                    ),
                  },
                  htmlInput: { "aria-label": "Search Gallery" },
                }}
              />
            </Box>
          </Stack>
        </Grid>
        {getPhotos.map((photo) => {
          return (
            <Grid
              key={photo.id}
              size={{
                xs: 12,
                lg: 4,
              }}
            >
              <BlankCard className="hoverCard">
                {isLoading ? (
                  <>
                    <Skeleton variant="rectangular" animation="wave" width="100%" height={220}></Skeleton>
                  </>
                ) : (
                  <CardMedia component={"img"} height="220" alt="Remy Sharp" src={photo.cover} sx={{ cursor: "pointer" }} />
                )}
                <Box p={3}>
                  <Stack direction="row" gap={1}>
                    <Box>
                      <Typography variant="h6">{photo.name}jpg</Typography>
                      <Typography variant="caption">{format(new Date(photo.time), "E, MMM d, yyyy")}</Typography>
                    </Box>
                    <Box ml={"auto"}>
                      <IconButton>
                        <IconDotsVertical size="16" />
                      </IconButton>
                    </Box>
                  </Stack>
                </Box>
              </BlankCard>
            </Grid>
          );
        })}
        <Grid
          key="add-new"
          size={{
            xs: 12,
            lg: 4,
          }}
          sx={{ mb: { xs: 2, md: 0 } }}
        >
          <BlankCard
            className="hoverCard"
            sx={{
              height: "100%",
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px dashed #d1d5db",
              color: "primary.main",
              transition: "border-color 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "primary.lighter",
              },
            }}
            onClick={onClickAddCompany}
          >
            <IconPlus size={48} stroke={1.5} />
            <Typography variant="subtitle1" mt={2} color="primary.main">
              สร้างบริษัทใหม่
            </Typography>
          </BlankCard>
        </Grid>
      </Grid>
    </>
  );
};

export default MyCompanyCard;

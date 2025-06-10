import { Box, CardContent, Grid, Skeleton, Typography } from "@mui/material";

const skeletons = Array(6).fill(0);

const SkeletonTopCards = () => (
  <Grid container spacing={3}>
    {skeletons.map((_, i) => (
      <Grid
        key={i}
        size={{
          xs: 6,
          sm: 4,
          lg: 2,
        }}
      >
        <Box bgcolor="grey.100" textAlign="center">
          <CardContent>
            <Skeleton variant="circular" width={50} height={50} sx={{ margin: "0 auto" }} />
            <Typography mt={1} variant="subtitle1" fontWeight={600}>
              <Skeleton width={80} />
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              <Skeleton width={60} />
            </Typography>
          </CardContent>
        </Box>
      </Grid>
    ))}
  </Grid>
);

export default SkeletonTopCards;

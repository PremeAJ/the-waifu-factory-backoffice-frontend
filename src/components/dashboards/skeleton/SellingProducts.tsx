import { Paper, CardContent, Typography, Box, Skeleton, Stack, Chip } from "@mui/material";

const SkeletonSellingProducts = () => (
  <Paper  variant="outlined">
    <CardContent>
      <Typography variant="h5" color="white">
        <Skeleton width={180} height={32} />
      </Typography>
      <Typography variant="subtitle1" color="white" mb={4}>
        <Skeleton width={120} height={24} />
      </Typography>
      <Box textAlign="center" mt={2} mb="-40px">
        <Skeleton variant="rectangular" width={300} height={220} />
      </Box>
    </CardContent>
    <Paper
      sx={{
        overflow: "hidden",
        zIndex: "1",
        position: "relative",
        margin: "10px",
        mt: "-43px"
      }}
    >
      <Box p={3}>
        <Stack spacing={3}>
          {[1, 2].map((_, i) => (
            <Box key={i}>
              <Stack direction="row" spacing={2} mb={1} justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">
                    <Skeleton width={100} />
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    <Skeleton width={60} />
                  </Typography>
                </Box>
                <Chip
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    borderRadius: "4px",
                    width: 55,
                    height: 24,
                  }}
                  label={<Skeleton width={30} />}
                />
              </Stack>
              <Skeleton variant="rectangular" height={8} />
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  </Paper>
);

export default SkeletonSellingProducts;
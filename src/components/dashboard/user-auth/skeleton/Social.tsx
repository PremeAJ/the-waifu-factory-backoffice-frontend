import { Stack, Typography, Avatar, Box, AvatarGroup, Skeleton } from '@mui/material';
import DashboardCard from '../../../shared/DashboardCard';

const SkeletonSocial = () => (
  <DashboardCard>
    <>
      <Stack direction="row" spacing={2}>
        <Skeleton variant="circular" width={70} height={70} />
        <Box>
          <Typography variant="h5">
            <Skeleton width={200} />
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            <Skeleton width={100} />
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" justifyContent="space-between" mt={5}>
        <AvatarGroup max={4}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="circular" width={40} height={40} />
          ))}
        </AvatarGroup>
        <Box
          width="40px"
          height="40px"
          bgcolor="primary.light"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Skeleton variant="circular" width={22} height={22} />
        </Box>
      </Stack>
    </>
  </DashboardCard>
);

export default SkeletonSocial;
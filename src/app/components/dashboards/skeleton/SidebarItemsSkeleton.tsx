import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';

const SidebarItemsSkeleton = () => (
  <Box sx={{ px: 3 }}>
    <List sx={{ pt: 0 }} className="sidebarNav">
      {/* Skeleton สำหรับ SubHeader */}
      <Skeleton variant="text" width={120} height={32} sx={{ mb: 2, mt: 2 }} />
      {/* Skeleton สำหรับเมนูหลัก */}
      {[...Array(5)].map((_, i) => (
        <Box key={i} sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" width="90%" height={40} sx={{ borderRadius: 2 }} />
          {/* Skeleton สำหรับ submenu */}
          {i === 1 || i === 3 ? (
            <Box sx={{ ml: 4, mt: 1 }}>
              <Skeleton variant="rectangular" width="70%" height={32} sx={{ borderRadius: 2, mb: 1 }} />
              <Skeleton variant="rectangular" width="60%" height={32} sx={{ borderRadius: 2 }} />
            </Box>
          ) : null}
        </Box>
      ))}
    </List>
  </Box>
);

export default SidebarItemsSkeleton;
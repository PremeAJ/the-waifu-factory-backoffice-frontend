import Grid from '@mui/material/Grid'
import PageContainer from '@/components/container/PageContainer';
import ProfileBanner from '@/components/apps/userprofile/profile/ProfileBanner';
import GalleryCard from '@/components/apps/userprofile/gallery/GalleryCard';
import Breadcrumb from '@/components/shared/breadcrumb/Breadcrumb';
import { UserDataProvider } from '@/context/UserDataContext';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Gallery',
  },
]
const Gallery = () => {
  return (
    <UserDataProvider>
      <PageContainer title="Gallery" description="this is Gallery">
        <Breadcrumb title="User App" items={BCrumb} />

        <Grid container spacing={3}>
          <Grid
            size={{
              sm: 12
            }}>
            <ProfileBanner />
          </Grid>
          <Grid
            size={{
              sm: 12
            }}>
            <GalleryCard />
          </Grid>
        </Grid>
      </PageContainer>
    </UserDataProvider>
  );
};

export default Gallery;

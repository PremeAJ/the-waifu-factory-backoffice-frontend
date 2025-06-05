import Grid from '@mui/material/Grid'
import PageContainer from '@/components/container/PageContainer';
import ProfileBanner from '@/components/apps/userprofile/profile/ProfileBanner';
import FriendsCard from '@/components/apps/userprofile/friends/FriendsCard';
import Breadcrumb from '@/components/shared/breadcrumb/Breadcrumb';
import { UserDataProvider } from '@/context/UserDataContext';



const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Friends',
  },
]

const Friends = () => {
  return (
    <UserDataProvider>
      <PageContainer title="Friends" description="this is Friends">
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
            <FriendsCard />
          </Grid>
        </Grid>
      </PageContainer>
    </UserDataProvider>
  );
};

export default Friends;

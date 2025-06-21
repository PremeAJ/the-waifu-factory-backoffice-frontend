import PageContainer from "@/components/container/PageContainer";
import HeaderAlert from "../../../components/layout/header/HeaderAlert";
import HomePageHeader from "../../../components/layout/header/HomePageHeader";
import C2a from "../../../components/frontend-pages/shared/c2a";
import Footer from "../../../components/layout/footer/FllowUsFooter";
import Banner from "../../../components/frontend-pages/portfolio/Banner";
import GalleryCard from "@/components/apps/userprofile/gallery/GalleryCard";
import { Box, Container } from "@mui/material";
import { UserDataProvider } from "@/context/UserDataContext/index";
const PricingPage = () => {
 return (
  <UserDataProvider>
   <PageContainer title="Portfolio" description="this is Portfolio">
    <HeaderAlert />
    <HomePageHeader />
    <Banner />
    <Box my={3}>
     <Container maxWidth="lg">
      <GalleryCard />
     </Container>
    </Box>
    <C2a />
    <Footer />
   </PageContainer>
  </UserDataProvider>
 );
};

export default PricingPage;

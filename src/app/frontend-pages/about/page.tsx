import PageContainer from "@/components/container/PageContainer";
import HeaderAlert from "../../../components/layout/header/HeaderAlert";
import HomePageHeader from "../../../components/layout/header/HomePageHeader";
import Leadership from "../../../components/frontend-pages/shared/leadership";
import Reviews from "../../../components/frontend-pages/shared/reviews";
import Pricing from "../../../components/pages/pricing";
import C2a from "../../../components/frontend-pages/shared/c2a";
import Footer from "../../../components/layout/footer/FllowUsFooter";
import Banner from "../../../components/frontend-pages/about/banner";
import Process from "../../../components/frontend-pages/about/process";
import KeyMetric from "../../../components/frontend-pages/about/key-metric";

const About = () => {
  return (
    <PageContainer title="About" description="this is About">
      <HeaderAlert />
      <HomePageHeader />
      <Banner />
      <Process />
      <KeyMetric />
      <Leadership />
      <Reviews />
      <Pricing />
      <C2a />
      <Footer />
    </PageContainer>
  );
};

export default About;

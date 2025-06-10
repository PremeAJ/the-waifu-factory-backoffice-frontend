import PageContainer from "@/components/container/PageContainer";
import LandingPageHeader from "../../components/layout/header/LandingPageHeader";
import Pricing from "@/components/pages/pricing";
import Footer from "@/components/layout/footer/FllowUsFooter";

const PricingPage = () => {
  return (
    <PageContainer title="Pricing" description="this is Pricing">
      <LandingPageHeader />
      <Pricing />
      <Footer />
    </PageContainer>
  );
};

export default PricingPage;

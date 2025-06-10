import PageContainer from "@/components/container/PageContainer";
import LpHeader from "../../components/landingpage/header/Header";
import Pricing from "@/components/pages/pricing";
import Footer from "@/components/shared/layout/footer/FllowUsFooter";

const PricingPage = () => {
  return (
    <PageContainer title="Pricing" description="this is Pricing">
      <LpHeader />
      <Pricing />
      <Footer />
    </PageContainer>
  );
};

export default PricingPage;

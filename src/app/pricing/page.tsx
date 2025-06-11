import PageContainer from "@/components/container/PageContainer";
import LandingPageHeader from "../../components/layout/header/LandingPageHeader";
import Pricing from "@/components/pages/pricing";
import Footer from "@/components/layout/footer/FllowUsFooter";
import { PlanProvider } from "@/context/PlanContext";

const PricingPage = () => {
  return (
    <PageContainer title="Pricing" description="this is Pricing">
      <PlanProvider>
      <LandingPageHeader />
      <Pricing />
      <Footer />
      </PlanProvider>
    </PageContainer>
  );
};

export default PricingPage;

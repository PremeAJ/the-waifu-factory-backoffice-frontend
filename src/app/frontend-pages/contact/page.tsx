import PageContainer from "@/components/container/PageContainer";
import HeaderAlert from "../../../components/layout/header/HeaderAlert";
import HomePageHeader from "../../../components/layout/header/HomePageHeader";

import C2a from "../../../components/frontend-pages/shared/c2a";
import Footer from "../../../components/layout/footer/FllowUsFooter";
import Banner from "../../../components/frontend-pages/contact/banner";
import Form from "../../../components/frontend-pages/contact/form";

const Contact = () => {
  return (
    <PageContainer title="Contact" description="this is Contact">
      <HeaderAlert />
      <HomePageHeader />
      <Banner />
      <Form />
      <C2a />
      <Footer />
    </PageContainer>
  );
};

export default Contact;

import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/app/dashboard/(Layout)/layout/shared/breadcrumb/Breadcrumb";
import AppCard from "@/components/shared/AppCard";
import ContactApp from "@/components/apps/contacts/index";
import { ContactContextProvider } from '@/context/Conatactcontext/index'
const Contacts = () => {
  return (
    <ContactContextProvider>
      <PageContainer title="Contact" description="this is Contact">
        <Breadcrumb title="Contact app" subtitle="List Your Contacts" />
        <AppCard>
          <ContactApp />
        </AppCard>
      </PageContainer>
    </ContactContextProvider>
  );
};

export default Contacts;

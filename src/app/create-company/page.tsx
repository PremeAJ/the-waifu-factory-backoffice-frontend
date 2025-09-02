import React from "react";
import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import CreateCompanyForm from "@/app/create-company/components/CreateCompanyForm";
import { AddressProvider } from "@/common/contexts/Master/AddressContext";
import { BusinessTypeProvider } from "@/common/contexts/Master/BusinessTypeContext";
import { ConsentProvider } from "@/common/contexts/Master/ConsentContext";

const createCompanyPage = () => {
  return (
    <PageContainer title="สร้างบริษัท" description="สร้างบริษัทใหม่เพื่อเริ่มใช้งานระบบ">
      <Breadcrumb title="สร้างบริษัท" subtitle="สร้างบริษัทใหม่เพื่อเริ่มใช้งานระบบ" />
      <AddressProvider>
        <BusinessTypeProvider>
          <ConsentProvider>
            <CreateCompanyForm />
          </ConsentProvider>
        </BusinessTypeProvider>
      </AddressProvider>
    </PageContainer>
  );
};

export default createCompanyPage;

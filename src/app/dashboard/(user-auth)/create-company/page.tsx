import React from "react";
import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import CreateCompanyForm from "@/components/dashboard/user-auth/create-company/CreateCompanyForm";
import { AddressProvider } from "@/context/Master/AddressContext";

const FormWizard = () => {
  return (
    <PageContainer title="สร้างบริษัท" description="สร้างบริษัทใหม่เพื่อเริ่มใช้งานระบบ">
      <Breadcrumb title="สร้างบริษัท" subtitle="สร้างบริษัทใหม่เพื่อเริ่มใช้งานระบบ" />
      <AddressProvider>
        <CreateCompanyForm />
      </AddressProvider>
    </PageContainer>
  );
};

export default FormWizard;

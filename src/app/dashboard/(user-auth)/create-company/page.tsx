import React from "react";
import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";

import FormWizardSteps from "@/components/forms/form-wizard/FormWizardSteps";

const FormWizard = () => {
  return (
    <PageContainer title="Form Wizard" description="this is Form Wizard">
      <Breadcrumb title="Form Wizard" subtitle="this is Form Wizard page" />
      <FormWizardSteps />
    </PageContainer>
  );
};

export default FormWizard;

"use client";

import { Box, Stepper, Step, StepLabel, Alert, Stack } from "@mui/material";
import { CompanyContext, CompanyType } from "@/common/contexts/CompanyContext";
import { ConsentContext } from "@/common/contexts/Master/ConsentContext";
import { PageUrl } from "@/common/constants/pageUrl";
import { useContext, useEffect, useState } from "react";
import { useDialog } from "@/common/contexts/DialogContext";
import { useFormik } from "formik";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import * as Yup from "yup";
import BaseButton from "@/common/components/base/BaseButton";
import CompanyInfoStep from "./step/CompanyInfoStep";
import ConfirmStep from "./step/ConfirmStep";
import ContactInfoStep from "./step/ContactInfoStep";
import ParentCard from "@/components/shared/ParentCard";

const steps = ["ข้อมูลบริษัท", "ข้อมูลผู้ติดต่อ", "ยืนยัน"];

const stepSchemas = [
  Yup.object({
    businessTypeId: Yup.number().typeError("กรุณาเลือกประเภทร้านค้า").required("กรุณาเลือกประเภทร้านค้า"),
    companyAddress: Yup.string() .required("กรุณากรอกที่อยู่บริษัท") .test("not-empty", "ที่อยู่ไม่ควรเป็นช่องว่าง", (val) => !!val && val.trim().length > 0),
    companyEmail: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมลบริษัท"),
    companyName: Yup.string().required("กรุณากรอกชื่อบริษัท"),
    districtId: Yup.number().typeError("กรุณาเลือกอำเภอ").required("กรุณาเลือกอำเภอ"),
    provinceId: Yup.number().typeError("กรุณาเลือกจังหวัด").required("กรุณาเลือกจังหวัด"),
    subdistrictId: Yup.number().typeError("กรุณาเลือกตำบล").required("กรุณาเลือกตำบล"),
    taxId: Yup.string() .matches(/^\d{13}$/, "เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก") .nullable() .notRequired(), 
    zipcodeId: Yup.string().required("กรุณากรอกรหัสไปรษณีย์"),
  }),
  Yup.object({
    contactEmail: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมลผู้ติดต่อ"),
    contactName: Yup.string().required("กรุณากรอกชื่อผู้ติดต่อ"),
    contactPhone: Yup.string().required("กรุณากรอกเบอร์โทรศัพท์"),
  }),
];

const CreateCompanyForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { createCompany } = useContext(CompanyContext);
  const { data: session, status } = useSession();
  const { fullName, email, phone } = session?.profile || {};
  const { getConsentData } = useContext(ConsentContext);
  const { updateProfile } = useProfile();
  const router = useRouter();
  const termsOfService = getConsentData("terms_of_service");

  const { showError } = useDialog();

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(async () => {
        router.push(PageUrl.DASHBOARD);
        await updateProfile();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, router]);

  const initialValues: Omit<CompanyType, "id"> = {
    businessTypeId: null,
    companyAddress: "",
    companyEmail: "",
    companyName: "",
    consents: [],
    contactEmail: email || "",
    contactName: fullName || "",
    contactPhone: phone || "",
    districtId: null,
    provinceId: null,
    subdistrictId: null,
    taxId: "",
    zipcodeId: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: stepSchemas[activeStep],
    enableReinitialize: true,
    onSubmit: async (data) => {
      try {
        await createCompany(data);
        setSubmitted(true);
        setActiveStep(steps.length);
      } catch (err: any) {
        showError({ message: err?.message, title: "เกิดข้อผิดพลาด", showDetails: true });
      }
    },
  });

  const handleNext = async () => {
    const errs = await formik.validateForm();
    if (Object.keys(errs).length === 0) {
      setActiveStep((prev) => prev + 1);
    } else {
      formik.setTouched(Object.keys(stepSchemas[activeStep].fields).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return <CompanyInfoStep formik={formik} />;
      case 1:
        return <ContactInfoStep formik={formik} />;
      case 2:
        return <ConfirmStep formik={formik} />;
      default:
        return null;
    }
  };

  return (
    <ParentCard title="สร้างบริษัทใหม่">
      <form onSubmit={formik.handleSubmit}>
        <Box width="100%">
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Stack spacing={2} mt={3}>
              <Alert severity="success">สร้างบริษัทสำเร็จ! กำลังนำคุณไปยังหน้า Dashboard...</Alert>
            </Stack>
          ) : (
            <>
              <Box mt={3}>{renderStep(activeStep)}</Box>
              <Box display="flex" flexDirection="row" mt={3}>
                <BaseButton fullWidth={false} color="inherit" variant="contained" disabled={activeStep === 0} onClick={handleBack} label="กลับ" />
                <Box flex="1 1 auto" />
                {activeStep < steps.length - 1 ? (
                  <BaseButton fullWidth={false} onClick={handleNext} variant="contained" color="secondary" label="ถัดไป" />
                ) : (
                  <BaseButton
                    fullWidth={false}
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={!formik.values.consents.find((c: any) => c.id === termsOfService?.id && c.accepted)}
                    label="ยืนยัน"
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      </form>
    </ParentCard>
  );
};

export default CreateCompanyForm;

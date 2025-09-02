"use client";

import { Box, Stepper, Step, StepLabel, Alert, Stack } from "@mui/material";
import { CompanyContext, CompanyType } from "@/common/contexts/CompanyContext";
import { ConsentContext } from "@/common/contexts/Master/ConsentContext";
import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import BaseButton from "@/common/components/base/BaseButton";
import CompanyInfoStep from "./step/CompanyInfoStep";
import ConfirmStep from "./step/ConfirmStep";
import ContactInfoStep from "./step/ContactInfoStep";
import ParentCard from "@/components/shared/ParentCard";
import { useSession } from "next-auth/react";
import { useError } from "@/common/contexts/ErrorContext";

const steps = ["ข้อมูลบริษัท", "ข้อมูลผู้ติดต่อ", "ยืนยัน"];

const stepSchemas = [
  Yup.object({
    companyName: Yup.string().required("กรุณากรอกชื่อบริษัท"),
    companyEmail: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมลบริษัท"),
    companyAddress: Yup.string()
      .required("กรุณากรอกที่อยู่บริษัท")
      .test("not-empty", "ที่อยู่ไม่ควรเป็นช่องว่าง", (val) => !!val && val.trim().length > 0),
    provinceId: Yup.number().typeError("กรุณาเลือกจังหวัด").required("กรุณาเลือกจังหวัด"),
    districtId: Yup.number().typeError("กรุณาเลือกอำเภอ").required("กรุณาเลือกอำเภอ"),
    subdistrictId: Yup.number().typeError("กรุณาเลือกตำบล").required("กรุณาเลือกตำบล"),
    zipcodeId: Yup.string().required("กรุณากรอกรหัสไปรษณีย์"),
    businessTypeId: Yup.number().typeError("กรุณาเลือกประเภทร้านค้า").required("กรุณาเลือกประเภทร้านค้า"),
    taxId: Yup.string()
      .matches(/^\d{13}$/, "เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก")
      .nullable()
      .notRequired(),
  }),
  Yup.object({
    contactName: Yup.string().required("กรุณากรอกชื่อผู้ติดต่อ"),
    contactEmail: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมลผู้ติดต่อ"),
    contactPhone: Yup.string().required("กรุณากรอกเบอร์โทรศัพท์"),
  }),
  // Yup.object({
  //   consent: Yup.boolean().oneOf([true], "กรุณายอมรับเงื่อนไขการใช้งาน"),
  // }),
];

const CreateCompanyForm = () => {
  const { data: session, status } = useSession();
  const { fullName, email, phone } = session?.profile || {};
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { getConsentData } = useContext(ConsentContext);
  const { createCompany } = useContext(CompanyContext);
  const termsOfService = getConsentData("terms_of_service");
  const router = useRouter();
  const { showError } = useError();

  // useEffect สำหรับนำทางไปยังหน้า Dashboard
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, router]);

  const initialValues: Omit<CompanyType, "id"> = {
    businessTypeId: null,
    companyAddress: "",
    companyEmail: "",
    companyName: "",
    consent: [],
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
      setSubmitError(null);
      try {
        const response = await createCompany(data);
        if (response.statusCode !== 200) {
          showError(response.message, "เกิดข้อผิดพลาด", true)
        } else {
          setSubmitted(true);
          setActiveStep(steps.length);
        }
      } catch (err: any) {
        setSubmitError(err?.message || "เกิดข้อผิดพลาดในการสร้างบริษัท");
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
              {submitError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {submitError}
                </Alert>
              )}
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
                    disabled={!formik.values.consent.find((c: any) => c.id === termsOfService?.id && c.accepted)}
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

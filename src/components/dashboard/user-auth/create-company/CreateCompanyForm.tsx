"use client";

import { useContext, useEffect, useState } from "react";
import { Box, Stepper, Step, StepLabel, Alert, Stack } from "@mui/material";
import ParentCard from "@/components/shared/ParentCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import CompanyInfoStep from "./step/CompanyInfoStep";
import ContactInfoStep from "./step/ContactInfoStep";
import ConfirmStep from "./step/ConfirmStep";
import { UserContext } from "@/context/UserContext";
import { ConsentContext } from "@/context/Master/ConsentContext";
import { CompanyContext, CompanyType } from "@/context/CompanyContext";
import { useRouter } from "next/navigation";
import BaseButton from "@/common/components/base/BaseButton";

const steps = ["ข้อมูลบริษัท", "ข้อมูลผู้ติดต่อ", "ยืนยัน"];

const stepSchemas = [
  Yup.object({
    companyName: Yup.string().required("กรุณากรอกชื่อบริษัท"),
    companyEmail: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมลบริษัท"),
    companyAddress: Yup.string()
      .required("กรุณากรอกที่อยู่บริษัท")
      .min(10, "ที่อยู่ต้องมีอย่างน้อย 10 ตัวอักษร")
      .test("not-empty", "ที่อยู่ไม่ควรเป็นช่องว่าง", (val) => !!val && val.trim().length > 0),
    provinceId: Yup.number().typeError("กรุณาเลือกจังหวัด").required("กรุณาเลือกจังหวัด"),
    districtId: Yup.number().typeError("กรุณาเลือกอำเภอ").required("กรุณาเลือกอำเภอ"),
    subdistrictId: Yup.number().typeError("กรุณาเลือกตำบล").required("กรุณาเลือกตำบล"),
    zipcodeId: Yup.string().required("กรุณากรอกรหัสไปรษณีย์"),
    businessTypeId: Yup.number().typeError("กรุณาเลือกประเภทร้านค้า").required("กรุณาเลือกประเภทร้านค้า"),
    taxId: Yup.string()
      .matches(/^\d{13}$/, "เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก")
      .nullable()
      .notRequired(), // ไม่บังคับกรอก
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
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null); // เพิ่ม state error
  const { getConsentData } = useContext(ConsentContext);
  const { createCompany } = useContext(CompanyContext);
  const termsOfService = getConsentData("terms_of_service");
  // เพิ่ม state สำหรับ dialog
  const { user } = useContext(UserContext);
  const { users, firstName, lastName } = user || {};
  const { email, phone } = users || {};
  const router = useRouter();

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
    companyName: "",
    companyEmail: "",
    companyAddress: "",
    contactName: `${firstName} ${lastName}` || "",
    contactEmail: email || "",
    contactPhone: phone || "",
    consent: [], 
    provinceId: null,
    districtId: null,
    subdistrictId: null,
    zipcodeId: null,
    businessTypeId: null,
    taxId: "", 
  };

  const formik = useFormik({
    initialValues,
    validationSchema: stepSchemas[activeStep],
    enableReinitialize: true,
    onSubmit: async (data) => {
      setSubmitError(null);
      try {
        await createCompany(data);
        setSubmitted(true);
        setActiveStep(steps.length);
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
              <Alert severity="success">
                สร้างบริษัทสำเร็จ! กำลังนำคุณไปยังหน้า Dashboard...
              </Alert>
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

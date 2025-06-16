"use client";

import { useContext, useEffect, useState } from "react";
import { Box, Stepper, Step, StepLabel, Alert, Stack } from "@mui/material";
import ParentCard from "@/components/shared/ParentCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseButton from "@/components/base/BaseButton";
import CompanyInfoStep from "./step/CompanyInfoStep";
import ContactInfoStep from "./step/ContactInfoStep";
import ConfirmStep from "./step/ConfirmStep";
import TransitionDialog from "@/components/base/Dialog/TransitionDialog";
import { ConsentContext } from "@/context/Master/ConsentContext";

const steps = ["ข้อมูลบริษัท", "ข้อมูลผู้ติดต่อ", "ยืนยัน"];

const initialValues = {
  companyName: "",
  companyEmail: "",
  companyAddress: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  agree: false,
  provinceId: undefined,
  districtId: undefined,
  subdistrictId: undefined,
  zipcodeId: undefined,
  businessTypeId: undefined,
  taxId: "", // เพิ่มตรงนี้
};

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
  //   agree: Yup.boolean().oneOf([true], "กรุณายอมรับเงื่อนไขการใช้งาน"),
  // }),
];

const CreateCompanyForm = () => {
  const [activeStep, setActiveStep] = useState(2);
  const [submitted, setSubmitted] = useState(false);

  // เพิ่ม state สำหรับ dialog
  const [openDialog, setOpenDialog] = useState(false);

  // mockup content ยาว ๆ
  const longContent = (
    <Box sx={{ minWidth: 400 }}>
      <h3>ข้อกำหนดและเงื่อนไข</h3>
      <p>
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i}>
            ข้อความตัวอย่างเนื้อหายาว ๆ สำหรับทดสอบการ scroll ใน dialog (บรรทัดที่ {i + 1})<br />
          </span>
        ))}
      </p>
    </Box>
  );

  const formik = useFormik({
    initialValues,
    validationSchema: stepSchemas[activeStep],
    enableReinitialize: true,
    onSubmit: (values) => {
      setSubmitted(true);
      setActiveStep(steps.length);
      console.log("🚀 ~ CreateCompanyForm ~ values:", values)
      // TODO: ส่งข้อมูลไป backend
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

  const handleReset = () => {
    setActiveStep(0);
    setSubmitted(false);
    formik.resetForm();
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
              <Alert severity="success">สร้างบริษัทสำเร็จ!</Alert>
              <Box textAlign="right">
                <BaseButton onClick={handleReset} variant="contained" color="error" label="สร้างใหม่" />
              </Box>
            </Stack>
          ) : (
            <>
              <Box mt={3}>{renderStep(activeStep)}</Box>
              <Box display="flex" flexDirection="row" mt={3}>
                <BaseButton
                  fullWidth={false}
                  color="inherit"
                  variant="contained"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  label="กลับ"
                />
                <Box flex="1 1 auto" />
                {activeStep < steps.length - 1 ? (
                  <BaseButton
                    fullWidth={false}
                    onClick={handleNext}
                    variant="contained"
                    color="secondary"
                    label="ถัดไป"
                  />
                ) : (
                  <BaseButton
                    fullWidth={false}
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={!formik.values.agree}
                    label="ยืนยัน"
                  />
                )}
                {/* ปุ่มสำหรับเปิด dialog ทดสอบ */}
                {/* <BaseButton
                  fullWidth={false}
                  variant="outlined"
                  color="primary"
                  label="ดูเงื่อนไข"
                  sx={{ ml: 2 }}
                  onClick={() => setOpenDialog(true)}
                /> */}
              </Box>
            </>
          )}
        </Box>
      </form>
      {/* Dialog พร้อม scroll */}
      {/* <TransitionDialog
        open={openDialog}
        title="ข้อกำหนดและเงื่อนไข"
        content={longContent}
        onConfirm={() => setOpenDialog(false)}
        onClose={() => setOpenDialog(false)}
        confirmText="ปิด"
        scrolling={true}
      /> */}
    </ParentCard>
  );
};

export default CreateCompanyForm;

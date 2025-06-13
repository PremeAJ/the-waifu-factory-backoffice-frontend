"use client";

import React, { useState, useEffect } from "react";
import { Box, Stepper, Step, StepLabel, Typography, FormControlLabel, Alert, Stack, Grid } from "@mui/material";
import ParentCard from "@/components/shared/ParentCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseTextField from "@/components/base/BaseTextField";
import CustomCheckbox from "@/components/forms/theme-elements/CustomCheckbox";
import BaseButton from "@/components/base/BaseButton";
import BaseAutoComplete from "@/components/base/BaseAutoComplete";

// สมมติข้อมูลตัวอย่าง
const provinces = [
  { id: 1, name: "กรุงเทพมหานคร" },
  { id: 2, name: "เชียงใหม่" },
  // ...
];
const districts = [
  { id: 1, name: "เมืองเชียงใหม่", provinceId: 2 },
  { id: 2, name: "สันทราย", provinceId: 2 },
  // ...
];
const subdistricts = [
  { id: 1, name: "ช้างเผือก", districtId: 1, postcode: "50300" },
  // ...
];

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
    postcode: Yup.string()
      .required("กรุณากรอกรหัสไปรษณีย์")
  }),
  Yup.object({
    contactName: Yup.string().required("กรุณากรอกชื่อผู้ติดต่อ"),
    contactEmail: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมลผู้ติดต่อ"),
    contactPhone: Yup.string().required("กรุณากรอกเบอร์โทรศัพท์"),
  }),
  Yup.object({
    agree: Yup.boolean().oneOf([true], "กรุณายอมรับเงื่อนไขการใช้งาน"),
  }),
];

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
  postcode: undefined,
};

const CreateCompanyForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: stepSchemas[activeStep],
    enableReinitialize: true,
    onSubmit: (values) => {
      setSubmitted(true);
      setActiveStep(steps.length);
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

  // ฟิลเตอร์อำเภอ/ตำบล ตามจังหวัดที่เลือก
  const filteredDistricts = districts.filter((d) => d.provinceId === formik.values.provinceId);
  const filteredSubdistricts = subdistricts.filter((s) => s.districtId === formik.values.districtId);
  const selectedSubdistrict = subdistricts.find((s) => s.id === formik.values.subdistrictId);

  useEffect(() => {
    if (selectedSubdistrict?.postcode && formik.values.subdistrictId) {
      formik.setFieldValue("postcode", selectedSubdistrict.postcode);
    } else if (!formik.values.subdistrictId) {
      formik.setFieldValue("postcode", "");
    }
    // eslint-disable-next-line
  }, [formik.values.subdistrictId, selectedSubdistrict?.postcode]);

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="companyName" label="ชื่อบริษัท" formik={formik} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="companyEmail" label="อีเมลบริษัท" type="email" formik={formik} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <BaseTextField name="companyAddress" label="ที่อยู่บริษัท" formik={formik} required fullWidth multiline rows={3} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseAutoComplete name="provinceId" label="จังหวัด" options={provinces} optionValueKey="id" optionLabelKey="name" formik={formik} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseAutoComplete
                name="districtId"
                label="อำเภอ"
                options={filteredDistricts}
                optionValueKey="id"
                optionLabelKey="name"
                formik={formik}
                disabled={!formik.values.provinceId}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseAutoComplete
                name="subdistrictId"
                label="ตำบล"
                options={filteredSubdistricts}
                optionValueKey="id"
                optionLabelKey="name"
                formik={formik}
                disabled={!formik.values.districtId}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField
                name="postcode"
                label="รหัสไปรษณีย์"
                formik={formik}
                value={selectedSubdistrict?.postcode}
                disabled={!formik.values.subdistrictId}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="contactName" label="ชื่อผู้ติดต่อ" formik={formik} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="contactEmail" label="อีเมลผู้ติดต่อ" type="email" formik={formik} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="contactPhone" label="เบอร์โทรศัพท์" formik={formik} required fullWidth />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box pt={3}>
            <Typography variant="h6" mb={2}>
              ตรวจสอบข้อมูลก่อนยืนยัน
            </Typography>
            <Typography variant="body2">
              <b>ชื่อบริษัท:</b> {formik.values.companyName}
              <br />
              <b>อีเมลบริษัท:</b> {formik.values.companyEmail}
              <br />
              <b>ที่อยู่บริษัท:</b> {formik.values.companyAddress}
              <br />
              <b>ชื่อผู้ติดต่อ:</b> {formik.values.contactName}
              <br />
              <b>อีเมลผู้ติดต่อ:</b> {formik.values.contactEmail}
              <br />
              <b>เบอร์โทรศัพท์:</b> {formik.values.contactPhone}
            </Typography>
            <FormControlLabel
              control={<CustomCheckbox checked={formik.values.agree} onChange={formik.handleChange} name="agree" onBlur={formik.handleBlur} />}
              label="ยอมรับเงื่อนไขการใช้งาน"
              sx={{ mt: 2 }}
            />
            {formik.touched.agree && formik.errors.agree && (
              <Typography color="error" variant="caption">
                {formik.errors.agree}
              </Typography>
            )}
          </Box>
        );
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
                <BaseButton onClick={handleReset} variant="contained" color="error">
                  สร้างใหม่
                </BaseButton>
              </Box>
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
                  <BaseButton fullWidth={false} type="submit" variant="contained" color="success" disabled={!formik.values.agree} label="ยืนยัน" />
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

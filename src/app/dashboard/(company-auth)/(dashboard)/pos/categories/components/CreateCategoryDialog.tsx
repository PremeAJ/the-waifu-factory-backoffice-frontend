"use client";
import React, { useState, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useCategories } from "@/common/contexts/CategoriesContext";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import useIsMobile from "@/common/utils/breakpoints/isMobile";

interface CreateCategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

// Yup validation schema
const validationSchema = yup.object({
  nameTh: yup
    .string()
    .required("กรุณากรอกชื่อหมวดหมู่ (ภาษาไทย)")
    .min(2, "ชื่อหมวดหมู่ต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(50, "ชื่อหมวดหมู่ต้องไม่เกิน 50 ตัวอักษร"),
  nameEn: yup
    .string()
    .max(50, "ชื่อหมวดหมู่ต้องไม่เกิน 50 ตัวอักษร")
    .matches(/^[a-zA-Z0-9\s]*$/, "ชื่อภาษาอังกฤษต้องใช้ตัวอักษรภาษาอังกฤษเท่านั้น"),
  parent: yup.string().optional(),
  isActive: yup.boolean().required("กรุณาเลือกสถานะ"),
});

const CreateCategoryDialog: React.FC<CreateCategoryDialogProps> = ({ open, onClose }) => {
  const [createLoading, setCreateLoading] = useState(false);

  const { categories, createCategory } = useCategories();
  const isMobile = useIsMobile();

  // สร้าง options สำหรับ BaseDropdown
  const parentCategoryOptions = useMemo(() => {
    return categories
      .filter((cat) => !cat.parent) // เอาแค่หมวดหมู่หลัก
      .map((cat) => ({
        value: cat.id,
        text: `${cat.nameTh}${cat.nameEn ? ` (${cat.nameEn})` : ""}`,
      }));
  }, [categories]);

  // สร้าง options สำหรับสถานะ
  const statusOptions = [
    { value: true, text: "เปิดใช้งาน" },
    { value: false, text: "ปิดใช้งาน" },
  ];

  const handleSubmit = async (values: any) => {
    setCreateLoading(true);

    try {
      await createCategory({
        nameTh: values.nameTh,
        nameEn: values.nameEn || undefined,
        isActive: values.isActive,
        parent: values.parent || undefined,
      });

      // Reset form and close dialog
      formik.resetForm();
      onClose();
    } catch (error: any) {
      formik.setStatus(error.message || "เกิดข้อผิดพลาดในการสร้างหมวดหมู่");
    }

    setCreateLoading(false);
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      nameTh: "",
      nameEn: "",
      parent: "",
      isActive: true,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleClose = () => {
    formik.resetForm();
    formik.setStatus(undefined);
    onClose();
  };

  const handleConfirm = async () => {
    await formik.submitForm();
  };

  return (
    <BaseDialog
      open={open}
      title="เพิ่มหมวดหมู่ใหม่"
      content={
        <Box sx={{ minWidth: 400 }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <BaseTextField
                formik={formik}
                name="nameTh"
                label="ชื่อหมวดหมู่ (ภาษาไทย)"
                placeholder="กรอกชื่อหมวดหมู่"
                required
              />
            </Grid>

            <Grid size={6}>
              <BaseTextField
                formik={formik}
                name="nameEn"
                label="ชื่อหมวดหมู่ (ภาษาอังกฤษ)"
                placeholder="Category name in English"
              />
            </Grid>

            <Grid size={6}>
              {/* Parent Category Dropdown */}
              <BaseDropdown
                formik={formik}
                name="parent"
                label="หมวดหมู่หลัก"
                options={parentCategoryOptions}
                showEmptyOption
                emptyOptionText="ไม่มี (สร้างเป็นหมวดหมู่หลัก)"
              />
            </Grid>

            <Grid size={6}>
              {/* Status Dropdown */}
              <BaseDropdown
                formik={formik}
                name="isActive"
                label="สถานะ"
                options={statusOptions}
                required
              />
            </Grid>

            {formik.status && (
              <Grid size={12}>
                <Box sx={{ color: "error.main", fontSize: "0.875rem" }}>{formik.status}</Box>
              </Grid>
            )}
          </Grid>
        </Box>
      }
      confirmText="สร้างหมวดหมู่"
      cancelText="ยกเลิก"
      onConfirm={handleConfirm}
      onClose={handleClose}
      loading={createLoading}
      fullScreen={isMobile}
    />
  );
};

export default CreateCategoryDialog;

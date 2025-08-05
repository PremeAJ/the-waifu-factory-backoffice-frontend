"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useCategories } from "@/common/contexts/CategoriesContext";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import useIsMobile from "@/common/utils/breakpoints/isMobile";

type DialogType = "create" | "edit";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  type: DialogType;
  categoryId?: string | null;
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

const CategoryDialog: React.FC<CategoryDialogProps> = ({ open, onClose, type, categoryId }) => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const { categories, createCategory, updateCategory, getCategoryById } = useCategories();
  const isMobile = useIsMobile();

  // สร้าง options สำหรับ BaseDropdown
  const parentCategoryOptions = useMemo(() => {
    return categories
      .filter((cat) => {
        // สำหรับ edit: ไม่รวมตัวเองและ subcategories
        if (type === "edit" && categoryId) {
          return !cat.parent && cat.id !== categoryId;
        }
        // สำหรับ create: เอาแค่หมวดหมู่หลัก
        return !cat.parent;
      })
      .map((cat) => ({
        value: cat.id,
        text: `${cat.nameTh}${cat.nameEn ? ` (${cat.nameEn})` : ""}`,
      }));
  }, [categories, type, categoryId]);

  // สร้าง options สำหรับสถานะ
  const statusOptions = [
    { value: true, text: "เปิดใช้งาน" },
    { value: false, text: "ปิดใช้งาน" },
  ];

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      if (type === "create") {
        await createCategory({
          nameTh: values.nameTh,
          nameEn: values.nameEn || undefined,
          isActive: values.isActive,
          parent: values.parent || null,
        });
      } else if (type === "edit" && categoryId) {
        await updateCategory(categoryId, {
          nameTh: values.nameTh,
          nameEn: values.nameEn || undefined,
          isActive: values.isActive,
          parent: values.parent || null,
        });
      }

      // Reset form and close dialog
      formik.resetForm();
      onClose();
    } catch (error: any) {
      const errorMessage = type === "create" 
        ? "เกิดข้อผิดพลาดในการสร้างหมวดหมู่"
        : "เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่";
      formik.setStatus(error.message || errorMessage);
    }

    setLoading(false);
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

  // Fetch category data when editing
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (type !== "edit" || !open || !categoryId) return;

      setFetchLoading(true);
      try {
        const categoryData = await getCategoryById(categoryId);
        
        formik.setValues({
          nameTh: categoryData.nameTh,
          nameEn: categoryData.nameEn || "",
          parent: categoryData.parent || "",
          isActive: categoryData.isActive,
        });
      } catch (error: any) {
        formik.setStatus(error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลหมวดหมู่");
      }
      setFetchLoading(false);
    };

    fetchCategoryData();
  }, [type, open, categoryId, getCategoryById]);

  const handleClose = () => {
    formik.resetForm();
    formik.setStatus(undefined);
    onClose();
  };

  const handleConfirm = async () => {
    await formik.submitForm();
  };

  // Dynamic props based on type
  const dialogProps = {
    title: type === "create" ? "เพิ่มหมวดหมู่ใหม่" : "แก้ไขหมวดหมู่",
    confirmText: type === "create" ? "สร้างหมวดหมู่" : "อัปเดตหมวดหมู่",
  };

  return (
    <BaseDialog
      open={open}
      title={dialogProps.title}
      content={
        <Box sx={{ minWidth: 400 }}>
          {fetchLoading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              กำลังโหลดข้อมูล...
            </Box>
          ) : (
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
                  emptyOptionText={
                    type === "create" 
                      ? "ไม่มี (สร้างเป็นหมวดหมู่หลัก)"
                      : "ไม่มี (เป็นหมวดหมู่หลัก)"
                  }
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
                  <Box sx={{ color: "error.main", fontSize: "0.875rem" }}>
                    {formik.status}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      }
      confirmText={dialogProps.confirmText}
      cancelText="ยกเลิก"
      onConfirm={handleConfirm}
      onClose={handleClose}
      loading={loading}
      fullScreen={isMobile}
    />
  );
};

export default CategoryDialog;
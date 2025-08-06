"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
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
  const [categoryData, setCategoryData] = useState<any>(null);
  const { categories, createCategory, updateCategory, getCategoryById } = useCategories();
  const isMobile = useIsMobile();

  const hasSubCategories = categoryData?.subCategories?.length > 0;

  const parentCategoryOptions = useMemo(() => {
    return categories
      .filter((cat) => {
        if (type === "edit" && categoryId) {
          return !cat.parent && cat.id !== categoryId;
        }
        return !cat.parent;
      })
      .map((cat) => ({
        value: cat.id,
        text: `${cat.nameTh}${cat.nameEn ? ` (${cat.nameEn})` : ""}`,
      }));
  }, [categories, type, categoryId]);

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
          parent: hasSubCategories ? undefined : values.parent || null,
        });
      }

      formik.resetForm();
      setCategoryData(null);
      onClose();
    } catch (error: any) {
      const errorMessage = type === "create" ? "เกิดข้อผิดพลาดในการสร้างหมวดหมู่" : "เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่";
      formik.setStatus(error.message || errorMessage);
    }

    setLoading(false);
  };

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

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (type !== "edit" || !open || !categoryId) {
        setCategoryData(null);
        return;
      }

      setFetchLoading(true);
      try {
        const fetchedCategoryData = await getCategoryById(categoryId);
        setCategoryData(fetchedCategoryData);

        formik.setValues({
          nameTh: fetchedCategoryData.nameTh,
          nameEn: fetchedCategoryData.nameEn || "",
          parent: fetchedCategoryData.parent || "",
          isActive: fetchedCategoryData.isActive,
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
    setCategoryData(null);
    onClose();
  };

  const handleConfirm = async () => {
    await formik.submitForm();
  };

  const dialogProps = {
    title: type === "create" ? "เพิ่มหมวดหมู่ใหม่" : "แก้ไขหมวดหมู่",
    confirmText: type === "create" ? "สร้างหมวดหมู่" : "อัปเดตหมวดหมู่",
  };

  return (
    <BaseDialog
      open={open}
      title={dialogProps.title}
      content={
        <Box>
          {
            <Grid container spacing={2}>
              <Grid size={isMobile ? 12 : 6}>
                <BaseTextField
                  loading={fetchLoading}
                  formik={formik}
                  name="nameTh"
                  label="ชื่อหมวดหมู่ (ภาษาไทย)"
                  placeholder="กรอกชื่อหมวดหมู่"
                  required
                />
              </Grid>

              <Grid size={isMobile ? 12 : 6}>
                <BaseTextField
                  loading={fetchLoading}
                  formik={formik}
                  name="nameEn"
                  label="ชื่อหมวดหมู่ (ภาษาอังกฤษ)"
                  placeholder="Category name in English"
                />
              </Grid>

              <Grid size={isMobile ? 12 : 6}>
                <BaseDropdown
                  loading={fetchLoading}
                  formik={formik}
                  name="parent"
                  label="หมวดหมู่หลัก"
                  options={parentCategoryOptions}
                  showEmptyOption
                  disabled={type === "edit" && hasSubCategories}
                  tooltip={type === "edit" && hasSubCategories ? "ไม่สามารถเปลี่ยนหมวดหมู่หลักได้เนื่องจากมีหมวดหมู่ย่อยอยู่" : undefined}
                  emptyOptionText={type === "create" ? "ไม่มี (สร้างเป็นหมวดหมู่หลัก)" : "ไม่มี (เป็นหมวดหมู่หลัก)"}
                />
              </Grid>

              <Grid size={isMobile ? 12 : 6}>
                <BaseDropdown loading={fetchLoading} formik={formik} name="isActive" label="สถานะ" options={statusOptions} required />
              </Grid>

              {formik.status && (
                <Grid size={12}>
                  <Box sx={{ color: "error.main", fontSize: "0.875rem" }}>{formik.status}</Box>
                </Grid>
              )}
            </Grid>
          }
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

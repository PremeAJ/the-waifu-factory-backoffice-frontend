"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useCategories } from "@/common/contexts/CategoriesContext";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseAutoComplete from "@/common/components/base/BaseAutoComplete";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import {  renderTablerIcon } from "@/common/utils/icon/getTablerIcon";
import { useUser } from "@/common/contexts/UserContext";
import { categoryNameEn, categoryNameThRequired, statusRequired, stringOptional } from "@/common/utils/validator/yup";

type DialogType = "create" | "edit";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  type: DialogType;
  categoryId?: string | null;
}

const validationSchema = yup.object({
  nameTh: categoryNameThRequired,
  nameEn: categoryNameEn,
  parent: stringOptional,
  isActive: statusRequired,
});

const CategoryDialog: React.FC<CategoryDialogProps> = ({ open, onClose, type, categoryId }) => {
  const {user} = useUser();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<any>(null);
  const { createCategory, updateCategory, getCategoryById, dropdown, categoryIcons } = useCategories();
  const isMobile = useIsMobile();
  const hasSubCategories = categoryData?.subCategories?.length > 0;
  const parentCategoryOptions = useMemo(() => {
    if (!dropdown || dropdown.length === 0) return [];
    
    return dropdown
      .filter((cat) => {
        if (type === "edit" && categoryId) {
          return cat.id !== categoryId; 
        }
        return true;
      })
      .map((cat) => ({
        value: cat.id,
        text: `${cat.nameTh}${cat.nameEn ? ` (${cat.nameEn})` : ""}`,
        icon: cat.icon,
      }));
  }, [dropdown, type, categoryId]);

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
          icon: values.icon || null,
        });
      } else if (type === "edit" && categoryId) {
        await updateCategory(categoryId, {
          nameTh: values.nameTh,
          nameEn: values.nameEn || undefined,
          isActive: values.isActive,
          parent: hasSubCategories ? undefined : values.parent || null,
          icon: values.icon || null,
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
      icon: "",
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
          icon: fetchedCategoryData.icon || "",
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
              <BaseAutoComplete
                formik={formik}
                name="parent"
                label="หมวดหมู่หลัก"
                options={parentCategoryOptions}
                placeholder="ค้นหาหมวดหมู่หลัก หรือปล่อยว่างเพื่อเป็นหมวดหมู่หลัก"
                loading={fetchLoading}
                disabled={type === "edit" && hasSubCategories}
                freeSolo={false}
                clearOnEscape
                orderBy={(a, b) => a.text.localeCompare(b.text)}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box 
                      component="li" 
                      key={key} 
                      {...otherProps} 
                      display="flex" 
                      alignItems="center" 
                      gap={1}
                    >
                      {option.icon && renderTablerIcon(option.icon, { size: 16 })}
                      {option.text}
                    </Box>
                  );
                }}
              />
            </Grid>

            <Grid size={isMobile ? 12 : 6}>
              <BaseDropdown 
                loading={fetchLoading} 
                formik={formik} 
                name="isActive" 
                label="สถานะ" 
                options={statusOptions} 
                required 
              />
            </Grid>

            <Grid size={isMobile ? 12 : 6}>
              <BaseDropdown
                loading={fetchLoading}
                formik={formik}
                name="icon"
                label="Icon"
                options={categoryIcons}
                placeholder="เลือก icon..."
                orderBy={(a, b) => a.text.localeCompare(b.text)}
                renderOption={(option) => (
                  <Box display="flex" alignItems="center" gap={1}>
                    {renderTablerIcon(option.value, { size: 16 })}
                    {option.text}
                  </Box>
                )}
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

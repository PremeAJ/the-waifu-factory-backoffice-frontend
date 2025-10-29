"use client";
import React from "react";

// MUI & Tabler Icons
import { useTheme } from "@mui/material/styles";
import { Grid, Typography, Box } from "@mui/material";
import { IconTag, IconStack } from "@tabler/icons-react";

// Project Components
import BaseDropdown, { OptionType } from "@/common/components/base/BaseDropdown";
import BaseTabs from "@/common/components/base/BaseTabs";
import BaseTextField from "@/common/components/base/BaseTextField";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import SingleProductForm from "./Variant/SingleProductForm";
import VariantOptionsList from "./Variant/VariantOptionsList";

// Enums & Interfaces
import { UnitTypeEnum } from "@/common/contexts/ProductsContext/interfaces/products";
import { useTax } from "@/common/contexts/Master/TaxContext";
import { I18nString } from "@/common/utils/i18n/I18nString";
import { useProfile } from "@/common/contexts/ProfileContext";

// --- Component Constants ---

export const unitTypeOptions: OptionType[] = [
  { text: "ชิ้น", value: UnitTypeEnum.PIECE, icon: "IconPackage" },
  { text: "น้ำหนัก", value: UnitTypeEnum.WEIGHT, icon: "IconScale" },
  { text: "ปริมาตร", value: UnitTypeEnum.VOLUME, icon: "IconDroplet" },
];

const emptyOption = (withVariant: boolean = true) => {
  const option: any = {
    upc: "",
    sku: "",
    price: 0,
    inventory: { status: "active", stock: 0 },
    discountType: "none",
    discountRate: 0,
  };

  if (withVariant) {
    option.variantOption = { nameTh: "", nameEn: "" };
  }

  return option;
};

// --- Main Component ---

interface ProductDetailsProps {
  formik?: any;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ formik }) => {
  const { isLanguage } = useProfile().appearance;
  const theme = useTheme();
  const { taxes, loading: taxLoading } = useTax();

  const [tab, setTab] = React.useState<number>(() => {
    const hasVariant = Boolean(formik?.values?.variant) || (formik?.values?.productOptions || []).some((o: any) => o?.variantOption);
    return hasVariant ? 1 : 0;
  });

  const tabs = React.useMemo(
    () => [
      { label: "ไม่มีตัวแปร", icon: <IconTag width={18} color={theme.palette.text.secondary} /> },
      { label: "มีตัวแปร", icon: <IconStack width={18} color={theme.palette.primary.main} /> },
    ],
    [theme]
  );

  const handleTabChange = (_: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
    if (!formik) return;

    const currentOptions = formik.values.productOptions || [];

    if (newTab === 0) {
      // Switching to Single Product
      const baseOption = currentOptions[0] || {};
      const singleOption = {
        ...emptyOption(false),
        upc: baseOption.upc ?? "",
        sku: baseOption.sku ?? "",
        price: baseOption.price ?? 0,
        inventory: baseOption.inventory ?? { status: "active", stock: 0 },
      };
      formik.setFieldValue("variant", undefined);
      formik.setFieldValue("productOptions", [singleOption]);
    } else {
      // Switching to Variant Product
      const variant = formik.values.variant ?? { nameTh: "", nameEn: "" };
      const hasAnyOption = currentOptions.length > 0;
      const newOptions = (hasAnyOption ? currentOptions : [emptyOption()]).map((opt: any) => ({
        ...opt,
        variantOption: opt.variantOption ?? { nameTh: "", nameEn: "" },
        inventory: opt.inventory ?? { status: "active", stock: 0 },
      }));
      formik.setFieldValue("variant", variant);
      formik.setFieldValue("productOptions", newOptions);
    }
  };

  const productOptions = formik?.values?.productOptions ?? [];

  const addOption = () => {
    formik?.setFieldValue("productOptions", [...productOptions, emptyOption()]);
  };

  const removeOption = (index: number) => {
    if (!formik || productOptions.length <= 1) return;
    const nextOptions = productOptions.filter((_: any, i: number) => i !== index);
    formik.setFieldValue("productOptions", nextOptions);
  };

  const taxClassOptions: OptionType[] = React.useMemo(() => {
    const sorted = [...(taxes || [])].sort((a, b) => {
      if (a.isDefault === b.isDefault) return 0;
      return a.isDefault ? -1 : 1; // default first
    });

    return sorted.map((t) => ({
      text: I18nString(isLanguage, t.nameTh ?? "", t.nameEn ?? ""),
      value: t.id,
    }));
  }, [taxes, isLanguage]);

  // sync selected tax rate -> p_vat
  React.useEffect(() => {
    if (!formik) return;
    const selectedId = formik.values?.taxClassId;
    const selected = (taxes || []).find((t) => t.id === selectedId);
    const rate = selected ? Number(selected.rate ?? 0) : 0;
    if (formik.values?.p_vat !== rate) {
      formik.setFieldValue("p_vat", rate);
    }
  }, [formik, taxes, formik?.values?.taxClassId]);

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">รายละเอียดสินค้า</Typography>
        <BaseTabs value={tab} onChange={handleTabChange} tabs={tabs} />
      </Box>

      <Grid container columnSpacing={2} mt={2}>
        <Grid size={{ xs: 6, md: 6 }}>
          <BaseDropdown formik={formik} name="unitType" label="ประเภทหน่วยนับ" options={unitTypeOptions} fullWidth required />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <BaseTextField formik={formik} fullWidth label="หน่วยย่อย" name="unit" placeholder="เช่น แท่ง, เล่ม, กิโลกรัม" required />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <BaseDropdown formik={formik} name="taxClassId" label="ประเภทภาษี" options={taxClassOptions} fullWidth loading={taxLoading} />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <BaseTextField
            name="p_vat"
            label="อัตรา VAT (%)"
            formik={formik}
            fullWidth
            type="number"
            disabled
            suffix="%"
          />
        </Grid>
      </Grid>

      {tab === 0 ? (
        <SingleProductForm formik={formik} />
      ) : (
        <>
          <Grid container columnSpacing={2} mt={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="variant.nameTh" formik={formik} label="ชื่อตัวแปร" placeholder="เช่น ขนาด" lang="th" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="variant.nameEn" formik={formik} label="ชื่อตัวแปร (EN)" placeholder="e.g. Size" lang="en" fullWidth />
            </Grid>
          </Grid>

          <CustomFormLabel sx={{ mt: 3 }}>ตัวเลือกของตัวแปร (เช่น S, M, L)</CustomFormLabel>
          <VariantOptionsList formik={formik} productOptions={productOptions} addOption={addOption} removeOption={removeOption} />
        </>
      )}
    </Box>
  );
};

export default ProductDetails;

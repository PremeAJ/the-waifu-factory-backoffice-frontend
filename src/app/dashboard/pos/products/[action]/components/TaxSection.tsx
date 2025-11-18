import { FC } from "react";
import { Grid } from "@mui/material";
import { BaseDropdown, BaseSwitch, BaseTextField } from "@/common/components/base";
import { OptionType } from "@/common/components/base/BaseDropdown";

interface TaxSectionProps {
  formik: any;
  taxClassOptions: OptionType[];
}

const TaxSection: FC<TaxSectionProps> = ({ formik, taxClassOptions }) => {
  const isTaxNone = formik?.values?.taxClassId === "none" || !formik?.values?.taxClassId;

  return (
    <>
      <Grid size={{ xs: 12, md: 4 }}>
        <BaseDropdown 
          formik={formik} 
          name="taxClassId" 
          label="ประเภทภาษี" 
          options={taxClassOptions} 
          fullWidth 
        />
      </Grid>
      {!isTaxNone && (
        <>
          <Grid size={{ xs: 12, md: 4 }}>
            <BaseTextField
              name="taxRate"
              label="อัตรา VAT (%)"
              formik={formik}
              fullWidth
              type="number"
              suffix="%"
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <BaseSwitch
              border
              formik={formik}
              name="isTaxInclusive"
              label="ราคารวมภาษี"
              labelPosition="inside"
              tooltip="หากไม่ได้เปิดไว้ ภาษีจะถูกนำไปคิดในบิล"
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default TaxSection;
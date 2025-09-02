import { BusinessTypeContext } from "@/common/contexts/Master/BusinessTypeContext";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { Grid } from "@mui/material";
import { I18nString } from "@/common/utils/i18n/I18nString";
import { UserContext } from "@/common/contexts/UserContext";
import Address from "@/components/forms/AddressForm";
import BaseAutoComplete from "@/common/components/base/BaseAutoComplete";
import BaseCheckBox from "@/common/components/base/BaseCheckBox";
import BaseTextField from "@/common/components/base/BaseTextField";
import React, { useContext, useEffect, useState } from "react";

const CompanyInfoStep = ({ formik }: any) => {
  const { businessTypes, isLoading: businessTypeLoading } = useContext(BusinessTypeContext);
  const { isLanguage } = useContext(CustomizerContext);
  const { user } = useContext(UserContext);
  const { users } = user || {};
  const { email } = users || {};

  const [useAccountEmail, setUseAccountEmail] = useState(false);

  useEffect(() => {
    if (useAccountEmail) {
      formik.setFieldValue("companyEmail", email || "", false);
    }
  }, [useAccountEmail, email]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseTextField name="companyName" label="ชื่อบริษัท" formik={formik} required fullWidth placeholder="กรอกชื่อบริษัท" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseTextField
          name="taxId"
          label="เลขประจำตัวผู้เสียภาษี (13 หลัก)"
          formik={formik}
          fullWidth
          placeholder="กรอกเลขประจำตัวผู้เสียภาษี"
          tooltip="เลขประจำตัวผู้เสียภาษี คือหมายเลข 13 หลักที่ออกโดยกรมสรรพากร ใช้สำหรับระบุตัวตนของบริษัทหรือบุคคลในการเสียภาษี เช่น 1234567890123"
          slotProps={{
            input: {
              inputProps: { maxLength: 13 },
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseTextField
          name="companyEmail"
          label="อีเมลบริษัท"
          type="email"
          formik={formik}
          required
          fullWidth
          disabled={useAccountEmail}
          placeholder="กรอกอีเมลบริษัท"
        />
        <BaseCheckBox
          name="useAccountEmail"
          label="ใช้อีเมลเดียวกับบัญชี"
          checked={useAccountEmail}
          onChange={(event: any) => {
            setUseAccountEmail(event.target.checked);
            if (event.target.checked) {
              formik.setFieldValue("companyEmail", email || "", false);
            } else {
              formik.setFieldValue("companyEmail", "", false);
            }
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseAutoComplete
          name="businessTypeId"
          label="ประเภทร้านค้า"
          options={businessTypes.map((item: any) => ({
            value: item.id,
            text: I18nString(isLanguage, item.nameTh, item.nameEn),
            group: I18nString(isLanguage, item.businessTypeCategories.nameTh, item.businessTypeCategories.nameEn),
          }))}
          formik={formik}
          loading={businessTypeLoading}
          required
          placeholder="เลือกประเภทร้านค้า"
          groupBy={(option) => option.group || ""}
        />
      </Grid>
      <Address formik={formik} />
    </Grid>
  );
};

export default CompanyInfoStep;

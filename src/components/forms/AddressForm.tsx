import React, { useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import BaseAutoComplete from "@/components/base/BaseAutoComplete";
import { AddressContext } from "@/context/Master/AddressContext";
import BaseTextField from "../base/BaseTextField";
import { CustomizerContext } from "@/context/setting/customizerContext";
import { I18nString } from "@/common/utils/i18n/I18nString";

interface AddressZoneProps {
  formik: any;
}

const AddressForm: React.FC<AddressZoneProps> = ({ formik }) => {
  const { isLanguage } = useContext(CustomizerContext);
  const { provinces, districts, subdistricts, zipcode, setProvinceId, setDistrictId, setSubdistrictId } = useContext(AddressContext);

  // เมื่อเปลี่ยนจังหวัด ให้ล้างค่าอำเภอ, ตำบล, รหัสไปรษณีย์
  useEffect(() => {
    setProvinceId(formik.values.provinceId ?? null);
    formik.setFieldValue("districtId", undefined, false);
    formik.setFieldValue("subdistrictId", undefined, false);
    formik.setFieldValue("zipcode", undefined, false);
  }, [formik.values.provinceId]);

  // เมื่อเปลี่ยนอำเภอ ให้ล้างค่าตำบล, รหัสไปรษณีย์
  useEffect(() => {
    setDistrictId(formik.values.districtId ?? null);
    formik.setFieldValue("subdistrictId", undefined, false);
    formik.setFieldValue("zipcode", undefined, false);
  }, [formik.values.districtId]);

  // เมื่อเปลี่ยนตำบล ให้ล้างค่ารหัสไปรษณีย์
  useEffect(() => {
    setSubdistrictId(formik.values.subdistrictId ?? null);
    formik.setFieldValue("zipcode", undefined, false);
  }, [formik.values.subdistrictId]);

  return (
    <React.Fragment>
      <Grid size={{ xs: 12 }}>
        <BaseTextField
          name="companyAddress"
          label="ที่อยู่บริษัท"
          formik={formik}
          required
          fullWidth
          multiline
          rows={3}
          placeholder="กรอกที่อยู่บริษัท"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseAutoComplete
          name="provinceId"
          label="จังหวัด"
          options={provinces.map((item) => ({ value: item.id, text: I18nString(isLanguage, item.nameTh, item.nameEn) }))}
          formik={formik}
          required
          placeholder="เลือกจังหวัด"
          orderBy={(a, b) => a.text.localeCompare(b.text)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseAutoComplete
          name="districtId"
          label="อำเภอ"
          options={districts.map((item: any) => ({ value: item.id, text: I18nString(isLanguage, item.nameTh, item.nameEn) }))}
          formik={formik}
          disabled={!formik.values.provinceId}
          required
          placeholder="เลือกอำเภอ"
          orderBy={(a, b) => a.text.localeCompare(b.text)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseAutoComplete
          name="subdistrictId"
          label="ตำบล"
          options={subdistricts.map((item: any) => ({ value: item.id, text: I18nString(isLanguage, item.nameTh, item.nameEn) }))}
          formik={formik}
          disabled={!formik.values.districtId}
          required
          placeholder="เลือกตำบล"
          orderBy={(a, b) => a.text.localeCompare(b.text)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseAutoComplete
          name="zipcodeId"
          label="รหัสไปรษณีย์"
          options={zipcode.map((item: any) => ({ value: item.id, text: item.zipcode }))}
          formik={formik}
          disabled={!formik.values.subdistrictId}
          required
          placeholder="เลือกรหัสไปรษณีย์"
          orderBy={(a, b) => a.text.localeCompare(b.text)}
        />
      </Grid>
    </React.Fragment>
  );
};

export default AddressForm;

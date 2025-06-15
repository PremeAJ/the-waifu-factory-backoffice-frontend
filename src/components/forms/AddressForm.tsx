import React, { useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import BaseAutoComplete from "@/components/base/BaseAutoComplete";
import { AddressContext } from "@/context/Master/AddressContext";
import BaseTextField from "../base/BaseTextField";

interface AddressZoneProps {
  formik: any;
}

const AddressForm: React.FC<AddressZoneProps> = ({ formik }) => {
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
          options={provinces.map((p) => ({ value: p.id, text: p.nameTh }))}
          formik={formik}
          required
          placeholder="เลือกจังหวัด"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseAutoComplete
          name="districtId"
          label="อำเภอ"
          options={districts.map((d: any) => ({ value: d.id, text: d.nameTh }))}
          formik={formik}
          disabled={!formik.values.provinceId}
          required
          placeholder="เลือกอำเภอ"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseAutoComplete
          name="subdistrictId"
          label="ตำบล"
          options={subdistricts.map((s: any) => ({ value: s.id, text: s.nameTh }))}
          formik={formik}
          disabled={!formik.values.districtId}
          required
          placeholder="เลือกตำบล"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseAutoComplete
          name="zipcode"
          label="รหัสไปรษณีย์"
          options={zipcode.map((z: any) => ({ value: z.id, text: z.zipcode }))}
          formik={formik}
          disabled={!formik.values.subdistrictId}
          required
          placeholder="เลือกรหัสไปรษณีย์"
        />
      </Grid>
    </React.Fragment>
  );
};

export default AddressForm;

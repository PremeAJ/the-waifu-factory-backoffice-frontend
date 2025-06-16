import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Grid, Divider, Card, CardContent, Stack, Link } from "@mui/material";
import BaseCheckBox from "@/components/base/BaseCheckBox";
import { ConsentContext } from "@/context/Master/ConsentContext";
import { AddressContext } from "@/context/Master/AddressContext";
import { getDisplayName } from "@/utils/function/object/getDisplayName";
import { CustomizerContext } from "@/context/setting/customizerContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BaseLinkButton from "@/components/base/BaseLinkButton";

const ConfirmStep = ({ formik }: any) => {
  const { consentData, getConsentData } = useContext(ConsentContext);
  const { provinces, districts, subdistricts, zipcode: zipcodes } = useContext(AddressContext);
  const { isLanguage } = useContext(CustomizerContext);

  // สำหรับ dialog เงื่อนไข (ถ้ามี)
  const [openDialog, setOpenDialog] = useState(false);

  // แปลง id เป็นชื่อ
  const province = getDisplayName(provinces, "id", formik.values.provinceId, "nameTh", "nameEn", isLanguage);
  const district = getDisplayName(districts, "id", formik.values.districtId, "nameTh", "nameEn", isLanguage);
  const subdistrict = getDisplayName(subdistricts, "id", formik.values.subdistrictId, "nameTh", "nameEn", isLanguage);
  const zipcode = getDisplayName(zipcodes, "id", formik.values.zipcodeId, "zipcode", "zipcode", isLanguage);

  useEffect(() => {
    getConsentData("terms_of_service");
  }, []);

  return (
    <Box pt={2}>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <CheckCircleIcon color="success" />
            <Typography variant="h6" color="primary">
              ข้อมูลบริษัท
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                ชื่อบริษัท
              </Typography>
              <Typography fontWeight="bold">{formik.values.companyName || "-"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                อีเมลบริษัท
              </Typography>
              <Typography fontWeight="bold">{formik.values.companyEmail || "-"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                เลขประจำตัวผู้เสียภาษี
              </Typography>
              <Typography fontWeight="bold">{formik.values.taxId || "-"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                ที่อยู่บริษัท
              </Typography>
              <Typography fontWeight="bold">
                {formik.values.companyAddress || "-"}
                <br />
                {subdistrict && `ตำบล${subdistrict} `}
                {district && `อำเภอ${district} `}
                {province && `จังหวัด${province} `}
                {zipcode && `${zipcode} `}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <CheckCircleIcon color="success" />
            <Typography variant="h6" color="primary">
              ข้อมูลผู้ติดต่อ
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                ชื่อผู้ติดต่อ
              </Typography>
              <Typography fontWeight="bold">{formik.values.contactName || "-"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                อีเมลผู้ติดต่อ
              </Typography>
              <Typography fontWeight="bold">{formik.values.contactEmail || "-"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                เบอร์โทรศัพท์
              </Typography>
              <Typography fontWeight="bold">{formik.values.contactPhone || "-"}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />
      <BaseCheckBox name="agree" formik={formik} />
      <BaseLinkButton onClick={() => setOpenDialog(true)} label="อ่านเงื่อนไขการใช้งาน" />
      
    </Box>
  );
};

export default ConfirmStep;

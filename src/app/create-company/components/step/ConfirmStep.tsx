import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Stack, Divider } from "@mui/material";
import { AddressContext } from "@/common/contexts/Master/AddressContext";
import { ConsentContext } from "@/common/contexts/Master/ConsentContext";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { getDisplayName } from "@/common/utils/function/object/getDisplayName";
import { I18nString } from "@/common/utils/i18n/I18nString";
import BaseCheckBox from "@/common/components/base/BaseCheckBox";
import BaseLinkButton from "@/common/components/base/BaseLinkButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BaseDialog from "@/common/components/base/BaseDialog";

const ConfirmStep = ({ formik }: any) => {
  const {
    provinceId,
    districtId,
    subdistrictId,
    zipcodeId,
    companyName,
    companyEmail,
    taxId,
    companyAddress,
    contactName,
    contactEmail,
    contactPhone,
  } = formik.values;
  const { getConsentData } = useContext(ConsentContext);
  const termsOfService = getConsentData("terms_of_service");
  const { provinces, districts, subdistricts, zipcode: zipcodes } = useContext(AddressContext);
  const { isLanguage } = useContext(CustomizerContext);

  // สำหรับ dialog เงื่อนไข (ถ้ามี)
  const [openDialog, setOpenDialog] = useState(false);

  // แปลง id เป็นชื่อ
  const province = getDisplayName(provinces, "id", provinceId, "nameTh", "nameEn", isLanguage);
  const district = getDisplayName(districts, "id", districtId, "nameTh", "nameEn", isLanguage);
  const subdistrict = getDisplayName(subdistricts, "id", subdistrictId, "nameTh", "nameEn", isLanguage);
  const zipcode = getDisplayName(zipcodes, "id", zipcodeId, "zipcode", "zipcode", isLanguage);

  useEffect(() => {
    getConsentData("terms_of_service");
  }, []);

  const consentId = termsOfService?.id;

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
              <Typography fontWeight="bold">{companyName || "-"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                อีเมลบริษัท
              </Typography>
              <Typography fontWeight="bold">{companyEmail || "-"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                เลขประจำตัวผู้เสียภาษี
              </Typography>
              <Typography fontWeight="bold">{taxId || "-"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                ที่อยู่บริษัท
              </Typography>
              <Typography fontWeight="bold">
                {companyAddress || "-"}
                <br />
                {subdistrictId && `ตำบล${subdistrict} `}
                {districtId && `อำเภอ${district} `}
                {provinceId && `จังหวัด${province} `}
                {zipcodeId && `${zipcode} `}
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
              <Typography fontWeight="bold">{contactName || "-"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                อีเมลผู้ติดต่อ
              </Typography>
              <Typography fontWeight="bold">{contactEmail || "-"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                เบอร์โทรศัพท์
              </Typography>
              <Typography fontWeight="bold">{contactPhone || "-"}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />
      <BaseCheckBox
        name="consent"
        checked={!!formik.values.consent.find((c: any) => c.id === consentId && c.accepted)}
        onChange={(e: any) => {
          if (consentId) {
            if (e.target.checked) {
              const arr = formik.values.consent.filter((c: any) => c.id !== consentId);
              formik.setFieldValue("consent", [...arr, { id: consentId, accepted: true }]);
            } else {
              const arr = formik.values.consent.filter((c: any) => c.id !== consentId);
              formik.setFieldValue("consent", arr);
            }
          }
        }}
        label="ยอมรับ"
      />
      <BaseLinkButton onClick={() => setOpenDialog(true)} label="ข้อกำหนดและเงื่อนไข" />

      <BaseDialog
        open={openDialog}
        title="ข้อกำหนดและเงื่อนไข"
        content={I18nString(isLanguage, termsOfService?.detailTh, termsOfService?.detailEn) || "ไม่มีข้อมูลเงื่อนไขการใช้งาน"}
        onConfirm={() => {
          if (consentId) {
            const arr = formik.values.consent.filter((c: any) => c.id !== consentId);
            formik.setFieldValue("consent", [...arr, { id: consentId, accepted: true }]);
          }
          setOpenDialog(false);
        }}
        onClose={() => {
          if (consentId) {
            const arr = formik.values.consent.filter((c: any) => c.id !== consentId);
            formik.setFieldValue("consent", arr);
          }
          setOpenDialog(false);
        }}
        confirmText="ยอมรับ"
        cancelText="ยกเลิก"
        scrolling
        htmlContent
      />
    </Box>
  );
};

export default ConfirmStep;

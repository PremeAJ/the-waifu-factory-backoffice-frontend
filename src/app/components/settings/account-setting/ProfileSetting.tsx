import React, { useContext, useState, useRef, useCallback } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import * as yup from "yup";
import { Stack, useTheme } from "@mui/system";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/context/UserContext";
import BaseTextField from "../../forms/theme-elements/BaseTextField";
import BaseButton from "../../forms/theme-elements/BaseButton";
import { useFormik } from "formik";
import {
  emailValidatorNotRequired,
  firstNameSchemaNotRequired,
  lastNameSchemaNotRequired,
  nickNameSchemaNotRequired,
  phoneSchemaNotRequired,
} from "@/utils/validator/yup";
import { IconPencil, IconMail, IconDeviceMobile } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { removeUndefinedAndNull } from "@/utils/function/object/object-cleaner";
import BaseLabel from "../../forms/theme-elements/BaseLabel";
import AvatarCropDialog from "../../ui-components/dialog/AvatarCropDialog";
import TransitionDialog from "../../ui-components/dialog/TransitionDialog";

const validationSchema = yup.object({
  firstName: firstNameSchemaNotRequired,
  lastName: lastNameSchemaNotRequired,
  nickName: nickNameSchemaNotRequired,
  // phone: phoneSchemaNotRequired,
  // email: emailValidatorNotRequired,
});

const AccountTab = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const { user, uploadAvatar, updateUser } = useContext(UserContext);
  const { firstName, lastName, avatarUrl, email, phone, nickName } = user || {};
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState<string | undefined>(avatarUrl);

  const [openCrop, setOpenCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  // Dialog state
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const router = useRouter();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setOpenCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // เปิด dialog ยืนยันยกเลิก
  const handleCancel = () => {
    setOpenCancelDialog(true);
  };

  // ยืนยันยกเลิก: reset form และ redirect
  const handleConfirmCancel = () => {
    formik.resetForm();
    setOpenCancelDialog(false);
    if (isMobile) router.back();
  };

  // ปิด dialog
  const handleCloseDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    const error = await updateUser(removeUndefinedAndNull(data));
    if (error) {
      alert(error);
    }
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      nickName: nickName || "",
      // email: email || "",
      // phone: phone || "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Typography variant="h5" mb={1}> {t("Setting.ChangeProfile")} </Typography>
        <Typography color="textSecondary" mb={3}> {t("Setting.ChangeProfileDesc")} </Typography>
        <Box textAlign="center" display="flex" justifyContent="center">
          <Box sx={{ position: "relative", display: "inline-block" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <Avatar
              src={preview ?? "/images/profile/user-1.jpg"}
              alt={`${firstName} profile`}
              sx={{
                width: 120,
                height: 120,
                margin: "0 auto",
                transition: "filter 0.2s",
                filter: hover ? "brightness(0.7)" : "none",
                cursor: "pointer",
              }}
              onClick={handleAvatarClick}
            />
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
            {hover && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 2,
                  border: "3px solid #fff",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                <IconPencil size={28} color="#fff" />
              </Box>
            )}
          </Box>
        </Box>
        <Typography variant="subtitle1" color="textSecondary" mb={4} mt={2} textAlign="center" fontSize={12}> {t("Setting.AllowedFile")} </Typography>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Typography variant="h5" mb={1}> {t("Setting.PersonalDetails")} </Typography>
        <Typography color="textSecondary" mb={3}> {t("Setting.PersonalDetailsDesc")} </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container columnSpacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}> <BaseTextField formik={formik} name="firstName" label={t("common.firstName")} placeholder="-" /> </Grid>
            <Grid size={{ xs: 12, sm: 6 }}> <BaseTextField formik={formik} name="lastName" label={t("common.lastName")} placeholder="-" /> </Grid>
            <Grid size={{ xs: 12, sm: 6 }}> <BaseTextField formik={formik} name="nickName" label={t("common.nickName")} placeholder="-" /> </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseLabel htmlFor="email" sx={{ display: "flex", alignItems: "center", gap: 1 }}> <IconMail size={18} style={{ marginRight: 4 }} /> {t("common.email")} <span style={{ color: theme.palette.primary.main, cursor: "pointer" }}>เปลี่ยน</span> </BaseLabel>
              <BaseTextField name="email" placeholder="-" value={email} disabled={true} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseLabel htmlFor="phone" sx={{ display: "flex", alignItems: "center", gap: 1 }}> <IconDeviceMobile size={18} style={{ marginRight: 4 }} /> {t("common.phone")} <span style={{ color: theme.palette.primary.main, cursor: "pointer" }}>เปลี่ยน</span> </BaseLabel>
              <BaseTextField name="phone" placeholder="-" value={phone} disabled={true} />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} sx={{ justifyContent: "end" }} mt={3}>
            <BaseButton preset="save" fullWidth={false} type="submit" loading={loading} disabled={!formik.dirty || loading} />
            <BaseButton preset="cancel" variant="text" fullWidth={false} loading={loading} onClick={handleCancel} />
          </Stack>
        </form>
      </Grid>
      <AvatarCropDialog
        open={openCrop}
        imageSrc={imageSrc}
        onClose={() => setOpenCrop(false)}
        onSave={(croppedImage) => {
          setOpenCrop(false);
          setPreview(croppedImage);
          uploadAvatar(croppedImage);
        }}
      />

      <TransitionDialog
        open={openCancelDialog}
        title="ยืนยันการยกเลิก"
        content="หากยืนยันยกเลิก การเปลี่ยนแปลงทั้งหมดจะไม่ถูกบันทึก"
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmColor="error"
        onConfirm={handleConfirmCancel}
        onClose={handleCloseDialog}
      />
    </Grid>
  );
};

export default AccountTab;

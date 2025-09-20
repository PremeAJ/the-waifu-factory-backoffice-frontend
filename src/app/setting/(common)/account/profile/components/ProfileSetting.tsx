import {
  firstNameSchemaNotRequired,
  lastNameSchemaNotRequired,
  nickNameSchemaNotRequired,
  phoneSchemaNotRequired,
} from "@/common/utils/validator/yup";
import { Grid, Typography } from "@mui/material";
import { IconPencil, IconMail, IconDeviceMobile } from "@tabler/icons-react";
import { ProfilePayload } from "@/common/contexts/ProfileContext/interfaces/interface";
import { Stack, useTheme } from "@mui/system";
import { useFormik } from "formik";
import { useProfile } from "@/common/contexts/ProfileContext";
import { UserContext } from "@/common/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import Avatar from "@mui/material/Avatar";
import AvatarCropDialog from "@/components/ui-components/dialog/AvatarCropDialog";
import BaseButton from "@/common/components/base/BaseButton";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseLabel from "@/common/components/base/BaseLabel";
import BaseTextField from "@/common/components/base/BaseTextField";
import Box from "@mui/material/Box";
import React, { useContext, useState, useRef } from "react";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import ChangeEmail, { ChangeEmailState } from "./ChangeEmail";
import BaseLinkButton from "@/common/components/base/BaseLinkButton";
import { useDialog } from "@/common/contexts/DialogContext";

const validationSchema = yup.object({
  firstName: firstNameSchemaNotRequired,
  lastName: lastNameSchemaNotRequired,
  nickName: nickNameSchemaNotRequired,
  phone: phoneSchemaNotRequired,
});

const AccountTab = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { showError } = useDialog();
  const { uploadAvatar } = useContext(UserContext);
  const { data: session, status } = useSession();
  const { updateProfile, loading:profileLoading } = useProfile();
  const { firstName, lastName, nickName, avatar, email, phone } = session?.profile || {};
  const [hover, setHover] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [openCrop, setOpenCrop] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(avatar);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [changeEmailDialog, setChangeEmailDialog] = useState<ChangeEmailState>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loading = status === 'loading' || profileLoading

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

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    formik.resetForm();
    setShowCancelDialog(false);
    if (isMobile) router.replace("/setting");
  };

  const formik = useFormik({
    initialValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      nickName: nickName || "",
      phone: phone || "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (data: Partial<ProfilePayload>) => {
      const response = await updateProfile(data);
      console.log("🚀 ~ AccountTab ~ response:", response)
      if (response?.error) {
        showError({ message: response.message });
      }
    },
  });

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Typography variant="h5" mb={1}>
          {t("Setting.ChangeProfile")}
        </Typography>
        <Typography color="textSecondary" mb={3}>
          {t("Setting.ChangeProfileDesc")}
        </Typography>
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
        <Typography variant="subtitle1" color="textSecondary" mb={4} mt={2} textAlign="center" fontSize={12}>
          {t("Setting.AllowedFile")}
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <Typography variant="h5" mb={1}>
          {t("Setting.PersonalDetails")}
        </Typography>
        <Typography color="textSecondary" mb={3}>
          {t("Setting.PersonalDetailsDesc")}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container columnSpacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseTextField formik={formik} name="firstName" label={t("common.firstName")} placeholder="-" loading={status === 'loading'}/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseTextField formik={formik} name="lastName" label={t("common.lastName")} placeholder="-" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseTextField formik={formik} name="nickName" label={t("common.nickName")} placeholder="-" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseTextField
                name="phone"
                formik={formik}
                label={t("common.phone")}
                labelIcon={<IconDeviceMobile size={18} style={{ marginRight: 4 }} />}
                placeholder="-"
                type="tel"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseLabel htmlFor="email" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconMail size={18} style={{ marginRight: 4 }} /> {t("common.email")}
                <BaseLinkButton label="เปลี่ยน" onClick={() => setChangeEmailDialog("newEmail")} bold />
              </BaseLabel>
              <BaseTextField name="email" value={email || "-"} disabled={true} />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} sx={{ justifyContent: "end" }} mt={3}>
            <BaseButton preset="cancel" variant="text" fullWidth={false} loading={loading} onClick={handleCancel} />
            <BaseButton preset="save" fullWidth={false} type="submit" loading={loading} disabled={!formik.dirty || loading} />
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

      <BaseDialog
        open={showCancelDialog}
        title="ยืนยันการยกเลิก"
        content="หากยืนยันยกเลิก การเปลี่ยนแปลงทั้งหมดจะไม่ถูกบันทึก"
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        onConfirm={handleConfirmCancel}
        onClose={() => setShowCancelDialog(false)}
      />
      <ChangeEmail state={changeEmailDialog} changeState={setChangeEmailDialog} />
      {/* <PhoneChangeFlow open={showPhoneChangeFlow} onClose={() => setShowPhoneChangeFlow(false)} currentPhone={phone || ""} /> */}
      {/* <OtpDialog
          open={true}
          onClose={() => console.log("close")}
          params={null}
          onSuccess={(data) => console.log("success", data)}
        /> */}
    </Grid>
  );
};

export default AccountTab;

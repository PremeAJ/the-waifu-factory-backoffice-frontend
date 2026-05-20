import {
  firstNameSchemaNotRequired,
  lastNameSchemaNotRequired,
  nickNameSchemaNotRequired,
  phoneSchemaNotRequired,
} from "@/common/utils/validator/yup";
import { Grid, Typography } from "@mui/material";
import { IconPencil, IconMail, IconDeviceMobile } from "@tabler/icons-react";
import { ProfilePayload } from "@/common/contexts/ProfileContext/interfaces/interface";
import { Stack } from "@mui/system";
import { useDialog } from "@/common/contexts/DialogContext";
import { useFormik } from "formik";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useWaifuUser } from "@/common/contexts/WaifuUserContext";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import Avatar from "@mui/material/Avatar";
import AvatarCropDialog from "@/components/ui-components/dialog/AvatarCropDialog";
import BaseButton from "@/common/components/base/BaseButton/BaseButton";
import BaseLabel from "@/common/components/base/BaseLabel";
import BaseLinkButton from "@/common/components/base/BaseLinkButton";
import BaseTextField from "@/common/components/base/BaseTextField";
import Box from "@mui/material/Box";
import ChangeEmail, { ChangeEmailState } from "./ChangeEmail";
import React, { useState, useRef, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const validationSchema = yup.object({
  firstName: firstNameSchemaNotRequired,
  lastName: lastNameSchemaNotRequired,
  nickName: nickNameSchemaNotRequired,
  phone: phoneSchemaNotRequired,
});

const AccountTab = () => {
  const { t } = useTranslation();
  const { showError } = useDialog();
  const { user } = useWaifuUser();
  const { updateProfile, uploadAvatar, loading: profileLoading } = useProfile();
  const firstName = user?.displayName ?? "";
  const lastName = "";
  const nickName = user?.username ?? "";
  const avatar = user?.profilePictureUrl ?? "";
  const email = "";
  const phone = "";
  const [changeEmailDialog, setChangeEmailDialog] = useState<ChangeEmailState>("");
  const [filename, setFilename] = useState<string>("");
  const [hover, setHover] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [openCrop, setOpenCrop] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loading = profileLoading;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setOpenCrop(true);
      };
      reader.readAsDataURL(file);
    }
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
      if (response?.error) {
        showError({ message: response.message });
      }
    },
  });

  useEffect(() => {
    if (avatar) setPreview(avatar);
  }, [avatar]);

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
            <Box
              sx={{
                position: "relative",
                cursor: loading ? "default" : "pointer",
                pointerEvents: loading ? "none" : "auto",
              }}
              onClick={handleAvatarClick}
            >
              <Avatar
                src={preview}
                alt={`${firstName} profile`}
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto",
                  transition: "filter 0.2s",
                  filter: hover ? "brightness(0.7)" : "none",
                }}
              />
              {hover && !loading && (
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
              {loading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255,255,255,0.6)",
                    borderRadius: "50%",
                    zIndex: 3,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Box>

            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} disabled={loading} />
          </Box>
        </Box>
        <Typography variant="subtitle1" color="textSecondary" mb={4} mt={2} textAlign="center" fontSize={12}>
          {t("Setting.AllowedFile")}
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <Typography variant="h5" mb={1}>
          {" "}
          {t("Setting.PersonalDetails")}{" "}
        </Typography>
        <Typography color="textSecondary" mb={3}>
          {" "}
          {t("Setting.PersonalDetailsDesc")}{" "}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container columnSpacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              {" "}
              <BaseTextField formik={formik} name="firstName" label={t("common.firstName")} placeholder="-" />{" "}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {" "}
              <BaseTextField formik={formik} name="lastName" label={t("common.lastName")} placeholder="-" />{" "}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {" "}
              <BaseTextField formik={formik} name="nickName" label={t("common.nickName")} placeholder="-" />{" "}
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
          uploadAvatar(croppedImage, filename);
        }}
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

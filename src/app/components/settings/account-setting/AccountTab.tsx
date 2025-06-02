import React, { useContext, useState, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import { Stack } from "@mui/system";
import { UserContext } from "@/app/context/UserContext";
import BaseTextField from "../../forms/theme-elements/BaseTextField";
import BaseButton from "../../forms/theme-elements/BaseButton";
import { useFormik } from "formik";
import { emailValidator, requiredPasswordSchema } from "@/utils/validator/yup";
import { IconPencil } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const validationSchema = yup.object({
  email: emailValidator,
  password: requiredPasswordSchema,
});

const MAX_FILE_SIZE = 800 * 1024; // 800KB

const AccountTab = () => {
  const { user, uploadAvatar } = useContext(UserContext);
  const { firstName, lastName, avatarUrl, email } = user || {};
  const [hover, setHover] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
        if (ev.target?.result) {
          uploadAvatar(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: firstName || "",
      email: email || "",
      lastName: lastName || "",
      nickName: "",
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {},
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
          <Box
            sx={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
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
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
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
              <BaseTextField formik={formik} name="firstName" label={t("common.firstName")} placeholder="-" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseTextField formik={formik} name="lastName" label={t("common.lastName")} placeholder="-" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseTextField formik={formik} name="nickName" label={t("common.nickName")} placeholder="-" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseTextField formik={formik} name="email" label={t("common.email")} placeholder="-" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BaseTextField formik={formik} name="phone" label={t("common.phone")} placeholder="-" />
            </Grid>
          </Grid>
        </form>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "end" }} mt={3}>
          <BaseButton preset="save" fullWidth={false} />
          <BaseButton preset="cancel" variant="text" fullWidth={false} />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AccountTab;

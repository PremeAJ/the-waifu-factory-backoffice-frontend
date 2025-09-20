import { ChangeEmailPayload } from "@/common/contexts/ProfileContext/interfaces/interface";
import { emailValidator, passwordRequired } from "@/common/utils/validator/yup";
import { IconKey, IconMail } from "@tabler/icons-react";
import { InputAdornment, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useProfile } from "@/common/contexts/ProfileContext";
import * as yup from "yup";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseTextField from "@/common/components/base/BaseTextField";
import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import { useDialog } from "@/common/contexts/DialogContext";
import { genOtpUrl } from "@/common/utils/otpUrl";
import { useRouter } from "next/navigation";

export type ChangeEmailState = "" | "newEmail" | "passwordConfirm" | "otp";

const validationSchema = yup.object({
  newEmail: emailValidator,
  password: passwordRequired,
});

interface ChangeEmailProps {
  state: ChangeEmailState;
  changeState: (state: ChangeEmailState) => void;
}

const ChangeEmail: React.FC<ChangeEmailProps> = ({ state, changeState }) => {
  const { changeEmail, loading } = useProfile();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { showError } = useDialog();
  const formik = useFormik({
    initialValues: {
      password: "",
      newEmail: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (data: Partial<ChangeEmailPayload>) => {
      const response = await changeEmail(data);
      if (response?.error) {
        showError({ message: response.message });
        return;
      }
      const { id, otpRef, otpType, email, expiresIn } = response.data;
      const url = genOtpUrl({ type: "email", reciver: email, otpType, id, otpRef, expiresIn });
      router.replace(url);
    },
  });

  useEffect(() => {
    if (state === "") {
      formik.resetForm();
    }
  }, [state]);

  return (
    <>
      <BaseDialog
        open={state === "newEmail"}
        title="เปลี่ยนอีเมล"
        content={
          <Box>
            <Typography variant="body2" color="textSecondary" mb={2}>
              กรอกอีเมลใหม่เพื่อรับลิงก์ยืนยัน
            </Typography>
            <BaseTextField
              sx={{ minWidth: 340 }}
              name="newEmail"
              type="email"
              formik={formik}
              placeholder="กรุณากรอกอีเมลใหม่"
              startAdornment={
                <InputAdornment position="start">
                  <IconMail width={20} />
                </InputAdornment>
              }
            />
          </Box>
        }
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        onConfirm={() => changeState("passwordConfirm")}
        onClose={() => changeState("")}
        loading={loading}
        fullScreen={isMobile}
        confirmDisabled={!formik.values.newEmail || !!formik.errors.newEmail}
      />
      <BaseDialog
        open={state === "passwordConfirm"}
        title="ยืนยันรหัสผ่าน"
        content={
          <Box>
            <Typography variant="body2" color="textSecondary" mb={2}>
              กรุณากรอกรหัสผ่านเพื่อยืนยันการเปลี่ยนอีเมล
            </Typography>
            <BaseTextField
              sx={{ minWidth: 340 }}
              formik={formik}
              name="password"
              type="password"
              placeholder="กรุณากรอก รหัสผ่าน"
              startAdornment={
                <InputAdornment position="start">
                  <IconKey width={20} />
                </InputAdornment>
              }
            />
          </Box>
        }
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        onConfirm={() => formik.submitForm()}
        onClose={() => changeState("")}
        loading={loading}
        fullScreen={isMobile}
      />
    </>
  );
};

export default ChangeEmail;

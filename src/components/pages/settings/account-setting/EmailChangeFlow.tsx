import React, { useState, useContext } from "react";
import { Box, InputAdornment, Typography, useMediaQuery, useTheme } from "@mui/material";
import { IconAlertTriangle, IconInfoCircle, IconMail } from "@tabler/icons-react";
import { UserContext } from "@/context/UserContext";
import { emailRegex } from "@/common/utils/validator/regex";
import TransitionDialog from "@/common/components/dialog/TransitionDialog";
import BaseTextField from "@/common/components/base/BaseTextField";

interface EmailChangeFlowProps {
  open: boolean;
  onClose: () => void;
  currentEmail: string;
}

const EmailChangeFlow: React.FC<EmailChangeFlowProps> = ({ open, onClose, currentEmail }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const { checkExistEmail, updateUserEmail } = useContext(UserContext);

  // Local states
  const [step, setStep] = useState<"input" | "sent">("input");
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Handle email verification send
  const handleSendEmailVerification = async () => {
    if (!newEmail) {
      setEmailError("กรุณากรอกอีเมลใหม่");
      return;
    }

    // Basic email validation
    if (!emailRegex.test(newEmail)) {
      setEmailError("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }

    if (newEmail === currentEmail) {
      setEmailError("อีเมลใหม่ต้องไม่เหมือนกับอีเมลเดิม");
      return;
    }

    setEmailLoading(true);
    setEmailError("");

    try {
      // Check if email already exists
      const emailExists = await checkExistEmail(newEmail);
      if (emailExists) {
        setEmailError("อีเมลนี้ถูกใช้งานแล้ว");
        setEmailLoading(false);
        return;
      }

      // Send verification email
      const { data, error } = await updateUserEmail(newEmail);

      if (error) {
        setEmailError("เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน กรุณาลองใหม่อีกครั้ง");
      } else {
        setStep("sent");
      }
    } catch (error) {
      setEmailError("เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน กรุณาลองใหม่อีกครั้ง");
    }

    setEmailLoading(false);
  };

  // Handle close and reset
  const handleClose = () => {
    setStep("input");
    setNewEmail("");
    setEmailError("");
    onClose();
  };

  return (
    <>
      {/* Dialog สำหรับกรอกอีเมลใหม่ */}
      <TransitionDialog
        open={open && step === "input"}
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
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              placeholder="กรุณากรอกอีเมลใหม่"
              startAdornment={
                <InputAdornment position="start">
                  <IconMail width={20} />
                </InputAdornment>
              }
            />
          </Box>
        }
        confirmText="ส่งลิงก์ยืนยัน"
        cancelText="ยกเลิก"
        onConfirm={handleSendEmailVerification}
        onClose={handleClose}
        loading={emailLoading}
        fullScreen={isMobile}
      />

      {/* Dialog แจ้งส่งอีเมลยืนยันสำเร็จ */}
      <TransitionDialog
        open={open && step === "sent"}
        icon="/images/breadcrumb/emailSv.png"
        iconSize={100}
        title="ส่งลิงก์ยืนยันแล้ว"
        content={
          <Box textAlign="center">
            <Typography variant="body1" mb={2}>
              เราได้ส่งลิงก์ยืนยันไปแล้ว
            </Typography>

            <Box sx={{ textAlign: "left", backgroundColor: "#f8f9fa", p: 2, borderRadius: 2, mb: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <IconAlertTriangle size={18} color="#f57c00" style={{ marginRight: 8 }} />
                <Typography variant="body2" fontWeight="bold" color="primary" component="div">
                  ต้องคลิกลิงก์ทั้งสองอีเมล
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      backgroundColor: "primary.main",
                      color: "white",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginRight: 1,
                    }}
                  >
                    1
                  </Box>
                  <Typography variant="body2" component="span" fontWeight="bold">
                    {currentEmail}
                  </Typography>
                  <Typography variant="body2" component="span" ml={1}>
                    (อีเมลเดิม)
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" mb={2} ml={3}>
                <IconInfoCircle size={16} color="#666" style={{ marginRight: 6 }} />
                <Typography variant="body2" color="textSecondary" fontSize="0.85rem" component="div">
                  เพื่อยืนยันว่าคุณเป็นเจ้าของบัญชี
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      backgroundColor: "primary.main",
                      color: "white",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginRight: 1,
                    }}
                  >
                    2
                  </Box>
                  <Typography variant="body2" component="span" fontWeight="bold">
                    {newEmail}
                  </Typography>
                  <Typography variant="body2" component="span" ml={1}>
                    (อีเมลใหม่)
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" ml={3}>
                <IconInfoCircle size={16} color="#666" style={{ marginRight: 6 }} />
                <Typography variant="body2" color="textSecondary" fontSize="0.85rem" component="div">
                  เพื่อยืนยันว่าคุณเป็นเจ้าของอีเมลใหม่
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="center">
              <IconAlertTriangle size={18} color="#f57c00" style={{ marginRight: 8 }} />
              <Typography variant="body2" color="warning.main" fontWeight="bold" component="div">
                หากคลิกลิงก์เพียงอีเมลเดียว การเปลี่ยนแปลงจะไม่สำเร็จ
              </Typography>
            </Box>
          </Box>
        }
        confirmText="เข้าใจแล้ว"
        cancelText=""
        onConfirm={handleClose}
        onClose={handleClose}
        fullScreen={isMobile}
      />
    </>
  );
};

export default EmailChangeFlow;

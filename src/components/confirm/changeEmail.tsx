"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Typography, Container, Paper, CircularProgress } from "@mui/material";
import { IconCheck, IconMail, IconAlertTriangle } from "@tabler/icons-react";
import BaseButton from "@/components/base/BaseButton";

const EmailConfirm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"loading" | "first_confirmed" | "email_changed" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleConfirmation = async () => {
      // ตรวจสอบ URL parameters
      const type = searchParams.get("type");
      const confirmationMessage = searchParams.get("message");
      const code = searchParams.get("code");

      console.log("Debug params:", { type, confirmationMessage, code });

      if (type === "email_change") {
        if (confirmationMessage && confirmationMessage.includes("Confirmation link accepted")) {
          // อีเมลแรก - ยืนยันสำเร็จ ให้ไปคลิกลิงก์ในอีเมลที่สอง
          setStatus("first_confirmed");
          setMessage("ยืนยันอีเมลแรกสำเร็จ");
          setLoading(false);
        } else if (code) {
          // อีเมลที่สอง - มี code มาให้ ผ่านเลยไม่ต้อง verify
          try {
            setLoading(true);
            setStatus("email_changed");
            setMessage("เปลี่ยนอีเมลสำเร็จ");
          } catch (error) {
            console.error("Unexpected error:", error);
            setStatus("error");
            setMessage("เกิดข้อผิดพลาดในการยืนยันอีเมล");
          }
          setLoading(false);
        } else {
          // ไม่มี parameter ที่ต้องการ
          setStatus("error");
          setMessage("ลิงก์ไม่ถูกต้อง");
          setLoading(false);
        }
      } else {
        // ไม่ใช่ email change type
        setStatus("error");
        setMessage("ลิงก์ไม่ถูกต้อง");
        setLoading(false);
      }
    };

    handleConfirmation();
  }, []);

  const handleGoToApp = () => {
    router.push("/setting");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6">กำลังตรวจสอบการยืนยัน...</Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, textAlign: "center" }}>
          {status === "first_confirmed" && (
            <>
              <Box sx={{ mb: 3 }}>
                <IconCheck size={80} color="#4caf50" />
              </Box>
              <Typography variant="h5" gutterBottom color="success.main">
                ยืนยันอีเมลแรกสำเร็จ
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                คุณได้ยืนยันอีเมลเดิมเรียบร้อยแล้ว
              </Typography>

              <Box sx={{ backgroundColor: "#fff3cd", p: 2, borderRadius: 2, mb: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                  <IconMail size={20} color="#856404" style={{ marginRight: 8 }} />
                  <Typography variant="body2" fontWeight="bold" color="#856404">
                    ขั้นตอนต่อไป
                  </Typography>
                </Box>
                <Typography variant="body2" color="#856404">
                  กรุณาตรวจสอบกล่องจดหมายของอีเมลใหม่ และคลิกลิงก์ยืนยันเพื่อเสร็จสิ้นการเปลี่ยนอีเมล
                </Typography>
              </Box>

              <BaseButton
                label="เข้าใจแล้ว"
                onClick={handleGoHome}
                fullWidth={false}
                color="primary"
              />
            </>
          )}

          {status === "email_changed" && (
            <>
              <Box sx={{ mb: 3 }}>
                <IconCheck size={80} color="#4caf50" />
              </Box>
              <Typography variant="h5" gutterBottom color="success.main">
                เปลี่ยนอีเมลสำเร็จ!
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                อีเมลของคุณได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว
              </Typography>

              <Box sx={{ backgroundColor: "#d4edda", p: 2, borderRadius: 2, mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <IconCheck size={16} color="#155724" />
                  <Typography variant="body2" color="#155724">
                    ยืนยันอีเมลเดิมสำเร็จ
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <IconCheck size={16} color="#155724" />
                  <Typography variant="body2" color="#155724">
                    ยืนยันอีเมลใหม่สำเร็จ
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconCheck size={16} color="#155724" />
                  <Typography variant="body2" color="#155724">
                    เปลี่ยนอีเมลเสร็จสิ้น
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ backgroundColor: "#fff3cd", p: 2, borderRadius: 2, mb: 3 }}>
                <Typography variant="body2" color="#856404" fontWeight="bold" mb={1}>
                  โปรดเข้าสู่ระบบใหม่
                </Typography>
                <Typography variant="body2" color="#856404">
                  เพื่อความปลอดภัย กรุณาเข้าสู่ระบบใหม่ด้วยอีเมลใหม่ของคุณ
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                <BaseButton
                  label="เข้าสู่ระบบใหม่"
                  onClick={() => router.push("/dashboard/auth/login")}
                  fullWidth={false}
                  color="primary"
                />
                <BaseButton
                  label="กลับหน้าหลัก"
                  onClick={handleGoHome}
                  fullWidth={false}
                  variant="outlined"
                />
              </Box>
            </>
          )}

          {status === "error" && (
            <>
              <Box sx={{ mb: 3 }}>
                <IconAlertTriangle size={80} color="#f44336" />
              </Box>
              <Typography variant="h5" gutterBottom color="error.main">
                เกิดข้อผิดพลาด
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                {message}
              </Typography>

              <Box sx={{ backgroundColor: "#f8d7da", p: 2, borderRadius: 2, mb: 3 }}>
                <Typography variant="body2" color="#721c24">
                  กรุณาลองใหม่อีกครั้ง หรือติดต่อทีมงานหากปัญหายังคงอยู่
                </Typography>
              </Box>

              <BaseButton
                label="กลับหน้าหลัก"
                onClick={handleGoHome}
                fullWidth={false}
                color="primary"
              />
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default EmailConfirm;
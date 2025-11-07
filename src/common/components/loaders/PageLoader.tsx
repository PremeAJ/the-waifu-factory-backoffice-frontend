"use client";
import Box from "@mui/material/Box";

export default function PageLoader() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        zIndex: 1400,
      }}
      aria-label="loading"
    >
      <Box
        sx={{
          display: "flex",
          gap: 1.25,
          alignItems: "flex-end",
          height: 40,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "primary.main",
              opacity: 0.65,
              transformOrigin: "center bottom",
              animation: `wave 900ms cubic-bezier(.2,.6,.2,1) infinite`,
              animationDelay: `${i * 110}ms`,
            }}
          />
        ))}
      </Box>

      <Box
        component="style"
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes wave {
            0% { transform: translateY(0); opacity: 0.6; }
            40% { transform: translateY(-14px); opacity: 1; }
            100% { transform: translateY(0); opacity: 0.6; }
          }
        `,
        }}
      />
    </Box>
  );
}
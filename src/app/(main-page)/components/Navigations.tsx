"use client";
import { IconBrandDiscord } from "@tabler/icons-react";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import BaseButton from "@/common/components/base/BaseButton/BaseButton";
import Button from "@mui/material/Button";
import React from "react";
import { useWaifuUser } from "@/common/contexts/WaifuUserContext";
import { PageUrl } from "@/common/constants/pageUrl";

const Navigations = () => {
  const { t } = useTranslation();
  const { user: waifuUser } = useWaifuUser();
  const StyledButton = styled(Button)(({ theme }) => ({
    fontSize: "16px",
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <StyledButton color="inherit" variant="text" href="/">
        Home
      </StyledButton>
      <StyledButton color="inherit" variant="text" href="/adoptables">
        Adoptable
      </StyledButton>
      <StyledButton color="inherit" variant="text" href="/auction">
        Auction
      </StyledButton>
      <StyledButton color="inherit" variant="text" href="/commission">
        Commission
      </StyledButton>
      {!waifuUser && (
        <BaseButton
          label="Login"
          href={PageUrl.AUTH_SIGN_IN}
          fullWidth={false}
          size="small"
          startIcon={<IconBrandDiscord size={18} />}
          sx={{
            bgcolor: "#5865F2",
            color: "#fff",
          }}
        />
      )}
    </>
  );
};

export default Navigations;

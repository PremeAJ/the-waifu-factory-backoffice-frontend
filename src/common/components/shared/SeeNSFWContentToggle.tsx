"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CookiesKey, setCookiesOption1Y } from "@/common/constants/cookies";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

interface SeeNSFWContentToggleProps {
  value?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

const COOKIE_KEY = CookiesKey.NSFW_MODE;

const SeeNSFWContentToggle: React.FC<SeeNSFWContentToggleProps> = ({ value, onChange, label = "See NSFW content" }) => {
  const [checked, setChecked] = useState<boolean>(typeof value === "boolean" ? value : false);

  useEffect(() => {
    if (typeof value === "boolean") {
      setChecked(value);
    } else {
      setChecked(Cookies.get(COOKIE_KEY) === "true");
    }
  }, [value]);

  useEffect(() => {
    if (typeof value !== "boolean") {
      Cookies.set(COOKIE_KEY, String(checked), setCookiesOption1Y);
    }
  }, [checked, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    onChange?.(e.target.checked);
  };

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Switch
        checked={checked}
        onChange={handleChange}
        color="error"
        inputProps={{ "aria-label": label }}
      />
      <Typography fontWeight={500} component="label" sx={{ cursor: "pointer", userSelect: "none" }}>
        {label}
      </Typography>
    </Stack>
  );
};

export default SeeNSFWContentToggle;

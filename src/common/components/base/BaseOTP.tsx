import React, { useRef } from "react";
import { Stack, TextField } from "@mui/material";

interface BaseOTPProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const BaseOTP: React.FC<BaseOTPProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
}) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const newValue =
      value.substring(0, idx) + val + value.substring(idx + 1, length);
    onChange(newValue);

    // Move to next input if value entered
    if (val && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <Stack spacing={2} direction="row">
      {Array.from({ length }).map((_, idx) => (
        <TextField
          key={idx}
          inputRef={el => (inputsRef.current[idx] = el)}
          value={value[idx] || ""}
          onChange={e => handleChange(idx, e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(idx, e)}
          inputProps={{
            maxLength: 1,
            style: { textAlign: "center", fontSize: 24, padding: "10px 0" },
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          autoFocus={idx === 0} // เพิ่มบรรทัดนี้
          disabled={disabled}
          variant="outlined"
          sx={{ width: 48 }}
        />
      ))}
    </Stack>
  );
};

export default BaseOTP;
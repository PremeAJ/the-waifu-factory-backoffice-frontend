"use client";
import React from "react";
import { Stack, Button } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import OptionItem from "./OptionItem";

type Props = {
  formik: any;
  productOptions: any[];
  updateOption: (index: number, path: string, value: any) => void;
  addOption: () => void;
  removeOption: (index: number) => void;
};

const VariantOptionsList: React.FC<Props> = ({ formik, productOptions, updateOption, addOption, removeOption }) => {
  return (
    <Stack spacing={2} mt={1}>
      {productOptions.map((opt: any, idx: number) => (
        <OptionItem key={idx} idx={idx} opt={opt} formik={formik} updateOption={updateOption} removeOption={removeOption} />
      ))}

      <Button variant="text" startIcon={<IconPlus />} onClick={addOption}>
        เพิ่มตัวเลือก
      </Button>
    </Stack>
  );
};

export default VariantOptionsList;
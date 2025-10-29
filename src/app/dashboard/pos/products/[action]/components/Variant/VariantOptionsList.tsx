"use client";
import React from "react";
import { Stack } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import OptionItem from "./OptionItem";
import BaseButton from "@/common/components/base/BaseButton";

type Props = {
  formik: any;
  productOptions: any[];
  addOption: () => void;
  removeOption: (index: number) => void;
};

const VariantOptionsList: React.FC<Props> = ({ formik, productOptions, addOption, removeOption }) => {
  return (
    <Stack spacing={2} mt={1}>
      {productOptions.map((_: any, idx: number) => (
        <OptionItem key={idx} idx={idx} formik={formik} removeOption={removeOption} />
      ))}

      <BaseButton  startIcon={<IconPlus />} onClick={addOption} label='เพิ่มตัวเลือก' size='small'/>
    </Stack>
  );
};

export default VariantOptionsList;
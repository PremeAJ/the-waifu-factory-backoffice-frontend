"use client";
import { BaseButton } from "@/common/components/base";
import { FC } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Stack } from "@mui/material";
import OptionItem from "./OptionItem";

type Props = {
  formik: any;
  productOptions: any[];
  addOption: () => void;
  removeOption: (index: number) => void;
};

const VariantOptionsList:FC<Props> = ({ formik, productOptions, addOption, removeOption }) => {
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
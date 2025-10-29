"use client";
import React from "react";
import ProductOptionFields from "./ProductOptionFields";

type Props = {
  formik: any;
};

const SingleProductForm: React.FC<Props> = ({ formik }) => {
  const optionPath = "productOptions[0]";

  return (
    <>
      <ProductOptionFields formik={formik} optionPath={optionPath} />
    </>
  );
};

export default SingleProductForm;

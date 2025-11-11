"use client";
import React from "react";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import { ProductsProvider } from "@/common/contexts/ProductsContext";

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CategoriesProvider>
      <ProductsProvider>
        {children}
      </ProductsProvider>
    </CategoriesProvider>
  );
}
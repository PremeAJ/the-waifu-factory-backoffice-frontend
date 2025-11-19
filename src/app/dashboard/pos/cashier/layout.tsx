"use client";
import React from "react";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import { ProductsProvider } from "@/common/contexts/ProductsContext";
import { CasheirProvider } from "@/common/contexts/CasheirContext";

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CategoriesProvider>
      <CasheirProvider>
      <ProductsProvider>
        {children}
      </ProductsProvider>
      </CasheirProvider>
    </CategoriesProvider>
  );
}
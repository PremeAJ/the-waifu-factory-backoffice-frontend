import React, { Suspense } from "react";
import PageLoader from "@/common/components/loaders/PageLoader";
import ProductsPageClient from "./ProductsPageClient";

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductsPageClient />
    </Suspense>
  );
}
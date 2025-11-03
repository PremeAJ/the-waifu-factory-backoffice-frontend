"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import { ProductsProvider, useProducts } from "@/common/contexts/ProductsContext";
import { TaxProvider } from "@/common/contexts/Master/TaxContext";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import ProductForm from "./components/ProductForm";
import type { ProductType } from "@/common/contexts/ProductsContext/interfaces/products";
import PageLoader from "@/common/components/loaders/PageLoader";

export default function AddOrEditProductClient({ title, crumb }: { title: string; crumb: any[] }) {
  return (
    <ProductsProvider>
      <CategoriesProvider>
        <TaxProvider>
          <PageContainer title={title} description={title}>
            <Breadcrumb title={title} items={crumb} />
            <ClientLoader />
          </PageContainer>
        </TaxProvider>
      </CategoriesProvider>
    </ProductsProvider>
  );
}

function ClientLoader() {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id") ?? undefined;
  const { getProductById } = useProducts();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(id));

  useEffect(() => {
    let mounted = true;
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getProductById(id)
      .then((p) => {
        if (!mounted) return;
        setProduct(p ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setProduct(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, getProductById]);

  if (loading) return <PageLoader />;

  return <ProductForm initialData={product} />;
}

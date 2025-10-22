import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import PageLoader from "@/common/components/loaders/PageLoader";
import AddOrEditProductClient from "./AddOrEditProductClient";

const BCrumb = [{ title: "POS" }, { to: "/dashboard/pos/products", title: "Products" }];

export default async function AddOrEditProduct({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
  const { action } = await params;
  if (action !== "create" && action !== "edit") {
    redirect("/dashboard/pos/products");
  }
  const title = action === "create" ? "Add Product" : "Edit Product";
  const crumb = [...BCrumb, { title }];

  return (
    <Suspense fallback={<PageLoader />}>
      <AddOrEditProductClient title={title} crumb={crumb} />
    </Suspense>
  );
}
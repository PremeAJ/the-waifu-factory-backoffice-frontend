import React, { Suspense } from "react";
import CommissionCreatePageContent from "@/components/pages/commission/CommissionCreatePageContent";
import Footer from "@/components/layout/footer/MainFooter";
import Header from "../../components/Header";

export default function CommissionCreatePage() {
  return (
    <>
      <Header />
      <Suspense>
        <CommissionCreatePageContent />
      </Suspense>
      <Footer />
    </>
  );
}

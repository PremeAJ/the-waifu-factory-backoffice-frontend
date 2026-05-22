import React, { Suspense } from "react";
import CommissionOpenCreatePageContent from "@/components/pages/commission/CommissionOpenCreatePageContent";
import Footer from "@/components/layout/footer/MainFooter";
import Header from "../../../components/Header";

export default function CommissionOpenCreatePage() {
  return (
    <>
      <Header />
      <Suspense>
        <CommissionOpenCreatePageContent />
      </Suspense>
      <Footer />
    </>
  );
}

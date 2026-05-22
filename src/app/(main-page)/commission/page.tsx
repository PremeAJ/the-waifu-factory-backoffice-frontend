import React, { Suspense } from "react";
import CommissionsPageContent from "@/components/pages/commission/CommissionsPageContent";
import Footer from "@/components/layout/footer/MainFooter";
import Header from "../components/Header";

export default function CommissionPage() {
  return (
    <>
      <Header />
      <Suspense>
        <CommissionsPageContent />
      </Suspense>
      <Footer />
    </>
  );
}

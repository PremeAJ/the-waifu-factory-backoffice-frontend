import React, { Suspense } from "react";
import AdoptablesPageContent from "@/components/pages/adoptables/AdoptablesPageContent";
import Footer from "@/components/layout/footer/MainFooter";
import Header from "../components/Header";

export default function AdoptablesPage() {
  return (
    <>
      <Header />
      <Suspense>
        <AdoptablesPageContent />
      </Suspense>
      <Footer />
    </>
  );
}

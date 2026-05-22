import React, { Suspense } from "react";
import CommissionDetailPageContent from "@/components/pages/commission/CommissionDetailPageContent";
import Footer from "@/components/layout/footer/MainFooter";
import Header from "../../components/Header";

export default async function CommissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Header />
      <Suspense>
        <CommissionDetailPageContent id={id} />
      </Suspense>
      <Footer />
    </>
  );
}

import React, { Suspense } from "react";
import CommissionOpenDetailPageContent from "@/components/pages/commission/CommissionOpenDetailPageContent";
import Footer from "@/components/layout/footer/MainFooter";
import Header from "../../../components/Header";

export default async function CommissionOpenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Header />
      <Suspense>
        <CommissionOpenDetailPageContent id={id} />
      </Suspense>
      <Footer />
    </>
  );
}

import React from "react";
import Header from "../../components/Header";
import Footer from "@/components/layout/footer/MainFooter";
import AdoptableDetailPageContent from "@/components/pages/adoptables/AdoptableDetailPageContent";

export default async function AdoptableDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <AdoptableDetailPageContent id={id} />
      <Footer />
    </>
  );
}

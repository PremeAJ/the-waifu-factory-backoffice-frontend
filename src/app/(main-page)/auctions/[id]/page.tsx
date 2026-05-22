import React from "react";
import Header from "../../components/Header";
import Footer from "@/components/layout/footer/MainFooter";
import AuctionDetailPageContent from "@/components/pages/auctions/AuctionDetailPageContent";

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <AuctionDetailPageContent id={id} />
      <Footer />
    </>
  );
}

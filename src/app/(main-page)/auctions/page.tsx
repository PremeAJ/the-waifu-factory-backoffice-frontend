import React from "react";
import Header from "../components/Header";
import Footer from "@/components/layout/footer/MainFooter";
import AuctionsPageContent from "@/components/pages/auctions/AuctionsPageContent";

export default function AuctionsPage() {
  return (
    <>
      <Header />
      <AuctionsPageContent />
      <Footer />
    </>
  );
}

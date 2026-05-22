import React from "react";
import Header from "../components/Header";
import Footer from "@/components/layout/footer/MainFooter";
import MemberPageContent from "@/components/pages/member/MemberPageContent";

export default function MemberPage() {
  return (
    <>
      <Header />
      <MemberPageContent />
      <Footer />
    </>
  );
}

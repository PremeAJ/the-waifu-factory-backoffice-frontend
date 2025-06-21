import React from "react";
import BlogList from "../../../components/frontend-pages/blog/blog-list/Blog";
import PageContainer from "@/components/container/PageContainer";
import HeaderAlert from "../../../components/layout/header/HeaderAlert";
import HomePageHeader from "../../../components/layout/header/HomePageHeader";
import C2a from "../../../components/frontend-pages/shared/c2a";
import Footer from "../../../components/layout/footer/FllowUsFooter";
import Banner from "../../../components/frontend-pages/blog/banner";

const BlogPage = () => {
  return (
    <>
      <PageContainer title="Pricing" description="this is Pricing">
        <HeaderAlert />
        <HomePageHeader />
        <Banner />
        <BlogList />
        <C2a />
        <Footer />
      </PageContainer>
    </>
  );
};

export default BlogPage;

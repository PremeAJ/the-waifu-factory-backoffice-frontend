import React from "react";
import BlogList from "../../../components/frontend-pages/blog/blog-list/Blog";
import PageContainer from '@/components/container/PageContainer';
import HeaderAlert from '../../../components/shared/layout/header/HeaderAlert';
import HpHeader from '../../../components/shared/layout/header/HpHeader';
import C2a from '../../../components/frontend-pages/shared/c2a';
import Footer from '../../../components/shared/layout/footer/FllowUsFooter';
import Banner from '../../../components/frontend-pages/blog/banner';
import ScrollToTop from '../../../components/shared/scroll-to-top';

const BlogPage = () => {

    return (
        <>
            <PageContainer title="Pricing" description="this is Pricing">

                <HeaderAlert />
                <HpHeader />
                <Banner />
                <BlogList />
                <C2a />
                <Footer />
                <ScrollToTop />
            </PageContainer>



        </>
    );
};

export default BlogPage;
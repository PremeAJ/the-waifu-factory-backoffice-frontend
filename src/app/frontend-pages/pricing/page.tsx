import PageContainer from '@/components/container/PageContainer';
import HeaderAlert from '../../../components/layout/header/HeaderAlert';
import HomePageHeader from '../../../components/layout/header/HomePageHeader';
import Pricing from '../../../components/pages/pricing';
import C2a from '../../../components/frontend-pages/shared/c2a';
import Footer from '../../../components/layout/footer/FllowUsFooter';
import Banner from '../../../components/frontend-pages/pricing/Banner';
import ScrollToTop from '../../../components/shared/scroll-to-top';

const PricingPage = () => {
    return (
        <PageContainer title="Pricing" description="this is Pricing">
            <HeaderAlert />
            <HomePageHeader />
            <Banner />
            <Pricing />
            <C2a />
            <Footer />
            <ScrollToTop />
        </PageContainer>
    );
};

export default PricingPage;

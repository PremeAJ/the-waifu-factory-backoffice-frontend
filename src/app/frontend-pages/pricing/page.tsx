import PageContainer from '@/components/container/PageContainer';
import HeaderAlert from '../../../components/shared/layout/header/HeaderAlert';
import HpHeader from '../../../components/shared/layout/header/HpHeader';
import Pricing from '../../../components/pages/pricing';
import C2a from '../../../components/frontend-pages/shared/c2a';
import Footer from '../../../components/shared/layout/footer/FllowUsFooter';
import Banner from '../../../components/frontend-pages/pricing/Banner';
import ScrollToTop from '../../../components/shared/scroll-to-top';

const PricingPage = () => {
    return (
        <PageContainer title="Pricing" description="this is Pricing">
            <HeaderAlert />
            <HpHeader />
            <Banner />
            <Pricing />
            <C2a />
            <Footer />
            <ScrollToTop />
        </PageContainer>
    );
};

export default PricingPage;

import PageContainer from '@/components/container/PageContainer';
import ScrollToTop from '../../components/shared/scroll-to-top';
import Pricing from '../../components/frontend-pages/shared/pricing';
import Footer from '../../components/frontend-pages/shared/footer';
import LpHeader from '../../components/landingpage/header/Header';

const PricingPage = () => {
    return (
        <PageContainer title="Pricing" description="this is Pricing">
            <LpHeader />
            <Pricing />
            <Footer />
            {/* <ScrollToTop /> */}
        </PageContainer>
    );
};

export default PricingPage;

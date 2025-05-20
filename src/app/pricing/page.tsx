import PageContainer from '@/app/components/container/PageContainer';
import ScrollToTop from '../components/frontend-pages/shared/scroll-to-top';
import Pricing from '../components/frontend-pages/shared/pricing';
import Footer from '../components/frontend-pages/shared/footer';
import LpHeader from '../components/landingpage/header/Header';
// import { useTranslation } from 'react-i18next';

const PricingPage = () => {
    // const { t } = useTranslation()
    return (
        <PageContainer title="Pricing" description="this is Pricing">
            <LpHeader />
            <Pricing />
            <Footer />
            <ScrollToTop />
        </PageContainer>
    );
};

export default PricingPage;

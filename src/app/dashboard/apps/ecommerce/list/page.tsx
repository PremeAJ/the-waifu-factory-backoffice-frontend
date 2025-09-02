
import Breadcrumb from '@/components/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import ProductTableList from '@/components/apps/ecommerce/ProductTableList/ProductTableList';
import BlankCard from '@/components/shared/BlankCard';
import { ProductProvider } from '@/context/Ecommercecontext/index'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Shop',
  },
];

const EcomProductList = () => {
  return (
    <ProductProvider>
      <PageContainer title="eCommerce Product List" description="this is eCommerce Product List">
        {/* breadcrumb */}
        <Breadcrumb title="Ecom-Shop" items={BCrumb} />
        <BlankCard>
          {/* ------------------------------------------- */}
          {/* Left part */}
          {/* ------------------------------------------- */}
          <ProductTableList />
        </BlankCard>
      </PageContainer>
    </ProductProvider>
  );
};

export default EcomProductList;

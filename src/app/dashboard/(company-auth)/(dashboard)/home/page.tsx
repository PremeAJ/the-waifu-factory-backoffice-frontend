import Breadcrumb from '@/components/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import BlogListing from '@/components/apps/blog/BlogListing';
import { BlogProvider } from '@/context/BlogContext/index';
const Home = () => {
  return (
    <BlogProvider>
      <PageContainer title="Home" description="this is Home">
        <Breadcrumb title="Home" subtitle="Get the latest news" />
        <BlogListing />
      </PageContainer>
    </BlogProvider>
  );
};

export default Home;

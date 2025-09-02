import Breadcrumb from '@/components/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import BlogListing from '@/components/apps/blog/BlogListing';
import { BlogProvider } from '@/context/BlogContext/index';
const Blog = () => {
  return (
    <BlogProvider>
      <PageContainer title="Blog" description="this is Blog">
        <Breadcrumb title="Blog app" subtitle="Get the latest news" />
        <BlogListing />
      </PageContainer>
    </BlogProvider>
  );
};

export default Blog;

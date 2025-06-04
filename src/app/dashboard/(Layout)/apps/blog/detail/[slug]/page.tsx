import BlogDetail from "@/components/apps/blog/detail";
import PageContainer from '@/components/container/PageContainer';
import { BlogProvider } from '@/context/BlogContext/index';
const BlogPost = () => {
  return (
    <BlogProvider>
      <PageContainer title="Blog Detail" description="this is Blog Detail">
        <BlogDetail />
      </PageContainer>
    </BlogProvider>
  );
};

export default BlogPost;

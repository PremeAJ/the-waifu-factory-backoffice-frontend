import Breadcrumb from "@/app/dashboard/(Layout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import AppCard from "@/components/shared/AppCard";
import NotesApp from "@/components/apps/notes";
import { NotesProvider } from '@/context/NotesContext/index'
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Notes",
  },
];

export default function Notes() {
  return (
    <NotesProvider>
      <PageContainer title="Note App" description="this is Note App">
        <Breadcrumb title="Note app" items={BCrumb} />
        <AppCard>
          <NotesApp />
        </AppCard>
      </PageContainer>
    </NotesProvider>
  );
}

import Header from "../../../components/Header";
import Footer from "@/components/layout/footer/MainFooter";
import ProfilePageContent from "@/components/pages/profile/ProfilePageContent";

export default async function UserProfileTabPage({
  params,
}: {
  params: Promise<{ username: string; slug: string[] }>;
}) {
  const { username, slug } = await params;
  const tab = slug[0] ?? "";
  const subTab = slug[1] ?? "";

  return (
    <>
      <Header />
      <ProfilePageContent username={username} tab={tab} subTab={subTab} />
      <Footer />
    </>
  );
}

import Header from "../../components/Header";
import Footer from "@/components/layout/footer/MainFooter";
import ProfilePageContent from "@/components/pages/profile/ProfilePageContent";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <>
      <Header />
      <ProfilePageContent username={username} tab="" subTab="" />
      <Footer />
    </>
  );
}

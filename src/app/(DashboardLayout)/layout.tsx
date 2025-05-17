import ServerAuthGuard from "./authGuard";
import ClientLayout from "./ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ServerAuthGuard>
        <ClientLayout>{children}</ClientLayout>
    </ServerAuthGuard>
  );
}

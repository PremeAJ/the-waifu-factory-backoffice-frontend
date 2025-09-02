import {  useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BaseDialog from "@/common/components/base/BaseDialog";
import Loading from "@/app/loading";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const {data:session, status} = useSession();
  const router = useRouter();

  const handleDialogClose = () => {
    router.push("/auth/sign-in");
  };

  return (
    <>
      <BaseDialog
        open={status !== 'loading' && !session?.profile}
        title="เกิดข้อผิดพลาด"
        content="Session ของคุณหมดอายุหรือไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่"
        confirmText="เข้าสู่ระบบ"
        onConfirm={handleDialogClose}
        onClose={handleDialogClose}
        confirmColor="primary"
      />
      {(status === 'authenticated' && session.profile && children) || <Loading />}
    </>
  );
}

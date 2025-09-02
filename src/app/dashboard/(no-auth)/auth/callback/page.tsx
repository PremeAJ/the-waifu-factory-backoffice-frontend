"use client";

import AuthCallbackHandler from "@/common/components/auth/AuthCallbackHandler";

export default function AuthCallback() {
  return <AuthCallbackHandler redirectPath="/dashboard" loginPath="/dashboard/auth/login" />;
}

"use client";

import AuthCallbackHandler from "@/app/components/auth/AuthCallbackHandler";

export default function AuthCallback() {
  return <AuthCallbackHandler redirectPath="/dashboard" loginPath="/dashboard/auth/login" />;
}

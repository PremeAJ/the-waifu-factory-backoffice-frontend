"use client";

import AuthCallbackHandler from "@/app/auth/authForms/AuthCallbackHandler";

export default function AuthCallback() {
  return <AuthCallbackHandler redirectPath="/dashboard" loginPath="/dashboard/auth/login" />;
}

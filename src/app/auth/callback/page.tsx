"use client";

import AuthCallbackHandler from "../../../components/auth/AuthCallbackHandler";

export default function AuthCallback() {
  return <AuthCallbackHandler redirectPath="/" loginPath="/auth/login" />;
}

"use client";

import AuthCallbackHandler from "../authForms/AuthCallbackHandler";

export default function AuthCallback() {
  return <AuthCallbackHandler redirectPath="/" loginPath="/auth/login" />;
}

type OtpType = "email" | "phone";

interface OtpUrlParams {
  type: OtpType;
  reciver: string;
  otpType: string;
  id: string | number;
  otpRef: string;
}

export function genOtpUrl(params: OtpUrlParams): string {
  const { type, reciver, otpType, id, otpRef } = params;
  if (!["email", "phone"].includes(type)) {
    throw new Error(`Invalid OTP type: ${type}`);
  }
  return `/otp/verify/${type}/${encodeURIComponent(reciver)}/${otpType}/${id}/${otpRef}`;
}
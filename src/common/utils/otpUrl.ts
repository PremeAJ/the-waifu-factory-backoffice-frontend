
interface OtpUrlParams {
  type: string;
  reciver: string;
  otpType: string;
  id: string | number;
  otpRef: string;
  expiresIn: number;
}

export function genOtpUrl(params: OtpUrlParams): string {
  const { type, reciver, otpType, id, otpRef, expiresIn } = params;
  if (!["email", "phone"].includes(type)) {
    throw new Error(`Invalid OTP type: ${type}`);
  }
  return `/otp/verify/${type}/${encodeURIComponent(reciver)}/${otpType}/${id}/${otpRef}/${expiresIn}`;
}
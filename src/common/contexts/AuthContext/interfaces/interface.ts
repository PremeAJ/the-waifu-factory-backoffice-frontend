import { ApiResponse } from "@/common/interface/apiResponse";

export interface AuthContextType {
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  forgotPassword: (payload:ForgotPasswordPayload) => Promise<ForgotPasswordResponse>;
  loading: boolean;
}

export interface RegisterPayload {
  email: string;
  phone?: string;
  lastName: string;
  password: string;
  firstName: string;
  nickName?: string;
  confirmPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface RegisterResponse extends ApiResponse {
  data: {
    id: string;
    otpRef: string;
    otpType: string;
    email: string;
    expiresIn: number;
  };
}

export interface ForgotPasswordResponse extends ApiResponse {
  data: {
    otpRef: string;
    otpType: string;
    email: string;
    expiresIn: number;
  };
}

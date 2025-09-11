import { ApiResponse } from "@/common/interface/apiResponse";


export interface AuthContextType {
  register: (payload:RegisterPayload) => Promise<RegisterResponse>;
  loading: boolean;
}

export interface RegisterPayload {
  email: string
  phone?: string
  lastName: string
  password: string
  firstName: string
  nickName?: string
  confirmPassword: string
}

export interface RegisterResponse extends ApiResponse {
  data:{
    id: string
    otpRef:string
    otpType: string
    email: string
    expiresIn: number
  }
}
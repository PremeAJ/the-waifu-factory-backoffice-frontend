

export interface AuthContextType {
  register: (payload:Register) => Promise<any>;
  loading: boolean;
}

export interface Register {
  email: string
  phone?: string
  lastName: string
  password: string
  firstName: string
  nickName?: string
  confirmPassword: string
}

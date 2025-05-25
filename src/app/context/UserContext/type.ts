export interface userType {
  userId: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  email: string;
  mobilePhone: string | null;
  role: string | null;
  permissionId: string | null;
  companyId: string | null;
}

export type UserContextType = {
  user: userType | null;
  loading: boolean;
  error: Error | null;
};

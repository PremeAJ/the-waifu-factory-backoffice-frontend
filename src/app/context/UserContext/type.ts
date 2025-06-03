export interface userType {
  id: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  email: string;
  phone: string | null;
  role: string | null;
  permissionId: string | null;
  companyId: string | null;
}

export interface SettingProfile {
  firstName?: string;
  lastName?: string;
  nickName?: string;
  email?: string;
  phone?: string
}
import { ApiResponse } from "@/common/interface/apiResponse";
import { KeyedMutator } from "swr";

export interface CompanyListItem {
  companies: Company;
  roles: Role;
}
export interface Company {
  id: string;
  name: string;
  logoUrl: string | null;
  businessTypeId: number;
  icon:string;
}

export interface Role {
  nameTh: string;
  nameEn: string;
}

export interface ActiveCompany {
  name: string;
  logoUrl: string;
  businessTypeId: number;
  icon:string
  branchNameTh: string;
  branchNameEn: string;
  roleNameTh: string;
  roleNameEn: string;
}

export interface ProfileContextType {
  error: any;
  loading: boolean;
  appearance: Appearance;
  profileLoading: boolean;
  appearanceLoading: boolean;
  companyList: CompanyListItem[];
  activeCompany: ActiveCompany | null;
  refreshProfile: () => Promise<any>;
  appearanceMutate: KeyedMutator<any>;
  companyListMutate: KeyedMutator<any>;
  activeCompanyMutate: KeyedMutator<any>;
  updateActiveCompany: (companyId: string) => Promise<any>;
  uploadAvatar: (base64: string, fileName:string) => Promise<any>;
  changeEmail: (payload: Partial<ChangeEmailPayload>) => Promise<any>;
  updateAppearance: (payload: Partial<AppearanceSettings>) => Promise<any>;
  updateProfile: (payload: Partial<ProfilePayload>) => Promise<ProfileResponse>;
}

export interface ProfileResponse extends ApiResponse {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    nickName: string;
    avatar: string;
    email: string;
    phone: string;
    activeCompany: string | null;
    hasReceivedTrial: boolean;
  };
}

export interface ProfilePayload {
  firstName: string;
  lastName: string;
  fullName: string;
  nickName: string;
  avatar: string;
  email: string;
  phone: string;
  activeCompany: string | null;
  hasReceivedTrial: boolean;
}

export interface Appearance {
  isLanguage: IsLanguage;
  activeMode: ActiveMode;
  activeTheme: string;
  isCollapse: IsCollapse;
  isBorderRadius: number;
  isLayout: IsLayout;
  isCardShadow: boolean;
}

export interface AppearanceSettings extends Appearance {}

export interface ChangeEmailPayload {
  newEmail: string;
  password: string;
}

export type IsLanguage = "en" | "th";
export type ActiveMode = "light" | "dark";
export type IsCollapse = "full_sidebar" | "mini_sidebar";
export type IsLayout = 'boxed' | 'full'
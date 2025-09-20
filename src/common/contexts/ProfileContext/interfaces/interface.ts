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
}

export interface Role {
  nameTh: string;
  nameEn: string;
}

export interface ActiveCompany {
  name: string;
  logoUrl: string;
  businessTypeId: number;
  branchNameTh: string;
  branchNameEn: string;
}

export interface ProfileContextType {
  activeCompany: ActiveCompany | null;
  companyList: CompanyListItem[];
  appearance: Appearance;
  loading: boolean;
  error: any;
  updateProfile: (payload: Partial<ProfilePayload>) => Promise<ProfileResponse>;
  companyListMutate: KeyedMutator<any>;
  activeCompanyMutate: KeyedMutator<any>;
  appearanceMutate: KeyedMutator<any>;
  refreshProfile: () => Promise<any>;
  updateActiveCompany: (companyId: string) => Promise<any>;
  changeEmail: (payload: Partial<ChangeEmailPayload>) => Promise<any>;
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
}

export interface ChangeEmailPayload {
  newEmail: string;
  password: string;
}

export type IsLanguage = "en" | "th";
export type ActiveMode = "light" | "dark";
export type IsCollapse = "full_sidebar" | "mini_sidebar";

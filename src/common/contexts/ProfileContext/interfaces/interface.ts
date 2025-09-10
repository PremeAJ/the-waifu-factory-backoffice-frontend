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
  companyListMutate: () => void;
  activeCompanyMutate: () => void;
  appearanceMutate: () => void;
  updateProfile: () => void;
  updateActiveCompany: (companyId: string) => Promise<any>;
}

export interface Appearance {
  isLanguage: IsLanguage;
  activeMode: ActiveMode;
  activeTheme: string;
  isCollapse: IsCollapse;
}

export type IsLanguage = "en" | "th";
export type ActiveMode = "light" | "dark";
export type IsCollapse = "full_sidebar" | "mini_sidebar";

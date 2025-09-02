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
  name: string
  logoUrl: string
  businessTypeId: number
  branchNameTh: string
  branchNameEn: string
}

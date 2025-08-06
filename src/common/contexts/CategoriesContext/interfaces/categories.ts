import { PageOptions } from "@/common/interface/paginate";

export interface CategoryType {
  id: string;
  companyId: string;
  branchId: string;
  nameTh: string;
  nameEn?: string | null;
  icon: string | null;
  parent: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  deletedBy: string | null;
  subCategories: CategoryType[];
}

export interface CategoryDropdownType {
  id: string;
  nameTh: string;
  nameEn?: string;
}

export interface CreateCategoryDto {
  nameTh: string;
  nameEn?: string;
  icon?: string;
  parent?: string;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  nameTh?: string;
  nameEn?: string;
  icon?: string;
  parent?: string;
  isActive?: boolean;
}

export interface CategoryDetailType extends CategoryType {
  // เพิ่ม fields พิเศษสำหรับ detail ถ้าจำเป็น
}

export interface CategoriesContextType {
  categories: CategoryType[];
  categoriesMutate: () => Promise<any>;
  createCategory: (payload: CreateCategoryDto) => Promise<any>;
  deleteCategory: (id: string) => Promise<any>;
  dropdown: CategoryDropdownType[];
  dropdownMutate: () => Promise<any>;
  error: Error | null;
  getCategoryById: (id: string) => Promise<CategoryDetailType>;
  isActive: boolean | null;
  loading: boolean;
  pageOptions: PageOptions;
  search: string;
  setIsActive: (isActive: boolean | null) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setSearch: (search: string) => void;
  updateCategory: (id: string, payload: UpdateCategoryDto) => Promise<any>;
}
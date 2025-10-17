import { PageOptions } from "@/common/interface/paginate";

export type CategoryStatus = "active" | "inactive" | "deleted";
export interface CategoryType {
  id: string;
  companyId: string;
  branchId: string;
  nameTh: string;
  nameEn?: string | null;
  icon: string | null;
  parent: string | null;
  status: CategoryStatus;
  subCategories: CategoryType[];
}

export interface CategoryDropdownType {
  id: string;
  nameTh: string;
  nameEn?: string;
  icon?: string;
}

export interface CreateCategoryDto {
  nameTh: string;
  nameEn?: string;
  parent?: string | null;
  status: CategoryStatus;
  icon?: string | null;
}

export interface UpdateCategoryDto {
  nameTh?: string;
  nameEn?: string;
  parent?: string | null;
  status?: CategoryStatus;
  icon?: string | null;
}

export interface CategoryDetailType extends CategoryType {
  subCategories: CategoryType[];
}

export interface CategoryFilters {
  search: string;
  status: CategoryStatus | "all";
}

export interface CategoryIconType {
  value: string;
  text: string;
}

export interface CategoriesContextType {
  error: any;
  loading: boolean;
  dropdown: CategoryType[];
  pageOptions: PageOptions;
  categories: CategoryType[];
  categoryIconsLoading: boolean;
  categoryIcons: CategoryIconType[];
  filters: CategoryFilters;
  dropdownMutate: () => void;
  categoriesMutate: () => void;
  categoryIconsMutate: () => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setFilters: (newFilters: Partial<CategoryFilters>) => void;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Promise<CategoryDetailType>;
  createCategory: (payload: CreateCategoryDto) => Promise<void>;
  updateCategory: (id: string, payload: UpdateCategoryDto) => Promise<void>;

  // --- เพิ่มสำหรับ Infinite Scroll ---
  loadMore: () => void;
  isLoadingMore: boolean;
  isReachingEnd: boolean;
}

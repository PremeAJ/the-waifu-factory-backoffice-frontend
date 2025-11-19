import { PageOptions } from "@/common/interface/paginate";

export interface MenuItem {
  id: string;
  nameTh: string;
  nameEn?: string | null;
  price?: number | null;
  status?: "active" | "inactive" | "deleted";
  categoryId?: string | null;
  tags?: string[];
  productFiles?: { id: string; bucket: string; originName: string; url: string }[];
  // เพิ่ม field ตาม API response ถ้าจำเป็น
}

export interface MenuFilters {
  search: string;
  status?: "active" | "inactive" | "deleted" | "all";
  categoryId?: string;
}

export interface CasheirContextType {
  menus: MenuItem[];
  filters: MenuFilters;
  loading: boolean;
  error?: any;
  perPage: number;
  pageOptions: PageOptions;
  isLoadingMore: boolean;
  isReachingEnd: boolean;
  loadMore: () => void;
  menusMutate: () => Promise<any>;
  getMenuById: (id: string) => Promise<MenuItem | null>;
}
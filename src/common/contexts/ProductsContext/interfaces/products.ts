import { PageOptions } from "@/common/interface/paginate";

export type ApiDiscountType = "none" | "percentage" | "fixed";
export type ApiInventoryStatus = "active" | "inactive" | "deleted";
export type UnitType = "piece" | "weight" | "volume";
export enum UnitTypeEnum {
  PIECE = "piece",
  WEIGHT = "weight",
  VOLUME = "volume",
}

export interface VariantType {
  nameTh: string;
  nameEn?: string | null;
}

export interface VariantOptionType {
  id?: string;
  nameTh: string;
  nameEn?: string | null;
}

export interface InventoryType {
  stock: number;
  status: ApiInventoryStatus;
  branchId?: string;
}

export interface ProductOptionType {
  id: string;
  upc?: string | null;
  sku?: string | null;
  basePrice: number;
  finalPrice?: number;
  pricePerUnit?: number;
  discountType?: ApiDiscountType;
  discountRate?: number;
  variantOption?: VariantOptionType | null;
  inventory?: InventoryType | null;
  lowStockThreshold?: number;
  productFiles?: {
    id: string;
    bucket: string;
    originName: string;
    url: string;
  };
}

export interface UploadedFile {
  id: string;
  bucket?: string;
  storagePath?: string;
  originName?: string;
  url?: string;
}

export interface ProductFile {
  uploadedFile: UploadedFile;
}

export interface TaxClassType {
  nameTh: string;
  nameEn?: string;
  rate: number;
}

export interface CategoryType {
  id: string;
  nameTh: string;
  nameEn?: string | null;
}

export interface ProductType {
  id: string;
  nameTh: string;
  nameEn?: string | null;
  descriptionTh?: string | null;
  descriptionEn?: string | null;
  unitType?: UnitTypeEnum | null;
  unit?: string | null;
  tags?: string[];
  variant?: VariantType | null;
  productFiles?: ProductFile[];
  productOptions?: ProductOptionType[];
  totalStock?: number;
  isTaxInclusive?: boolean;
  taxClassId?: string | null;
  taxClass?: TaxClassType | null;
  categories?: CategoryType | null;
  status?: ApiInventoryStatus | "active" | "inactive" | "deleted";
  price?: string;
  displayPrice?: string;
  basePrice?: number;
  lowStockThreshold?: number;
}

export interface CreateProductOptionPayload {
  upc?: string;
  sku?: string;
  basePrice: number;
  finalPrice: number;
  pricePerUnit: number;
  discountType: ApiDiscountType;
  discountRate: number;
  variantOption?: VariantOptionType;
  inventory: { status: ApiInventoryStatus; stock: number; branchId?: string };
  thumbnailImageId?: string;
  thumbnailImageUrl?: string;
  thumbnailOriginName?: string;
  lowStockThreshold?: number;
}

export interface CreateProductPayload {
  nameTh: string;
  nameEn?: string;
  descriptionTh?: string;
  descriptionEn?: string;
  unitType: UnitTypeEnum;
  unit: string;
  categoryId?: string;
  branchId?: string;
  detailImageIds?: string[];
  tags?: string[];
  isTaxInclusive: boolean;
  taxClassId: string;
  taxRate: number;
  variant?: VariantType;
  productOptions: CreateProductOptionPayload[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

export interface UpdateInventoryPayload {
  branchId: string;
  quantity: number;
}

export interface ProductsContextType {
  products: ProductType[];
  productsMutate: () => void;
  createProduct: (payload: CreateProductPayload) => Promise<void>;
  updateProduct: (id: string, payload: UpdateProductPayload) => Promise<void>;
  updateInventory: (id: string, payload: UpdateInventoryPayload) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Promise<ProductType>;
  loading: boolean;
  actionLoading: boolean;
  pageOptions: PageOptions;
}

export interface ApiListResponse<T> {
  pageOptions?: PageOptions;
  data: T[];
}

export type ProductStatus = "active" | "inactive" | "deleted";

export interface ProductFilters {
  search: string;
  status?: ProductStatus | "all";
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  stockMin?: number;
  stockMax?: number;
  isLowStock?: boolean;
}

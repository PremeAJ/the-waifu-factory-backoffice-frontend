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

export interface InventoryType {
  id: string;
  branchId: string;
  stock: number;
  status: string;
}

export interface VariantOptionType {
  nameTh: string;
  nameEn?: string | null;
}

export interface ProductOptionType {
  upc?: string;
  sku?: string;
  price?: number;
  variantOption?: VariantOptionType | null;
  inventory?: InventoryType | null;

  // discount fields
  discountType?: ApiDiscountType;
  // numeric discount value (percentage or fixed amount depending on discountType)
  discountRate?: number;
}

export interface ProductType {
  id: string;
  nameTh: string;
  nameEn?: string | null;
  descriptionTh?: string | null;
  descriptionEn?: string | null;
  unitType?: UnitTypeEnum | null;
  unit?: string | null;
  variant?: VariantType | null;
  productOptions?: ProductOptionType[];
  totalStock?: number;
}
export interface CreateProductOptionPayload {
  upc?: string;
  sku?: string;
  price: number;
  discountType: ApiDiscountType;
  discountRate: number; 
  variantOption?: VariantOptionType;
  inventory: { status: ApiInventoryStatus; stock: number };
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
  thumbnailImageId?: string;
  detailImageIds?: string[];

  isTaxInclusive: boolean;
  taxClassId: string;

  variant?: VariantType;
  productOptions: CreateProductOptionPayload[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  
}

export interface ProductsContextType {
  products: ProductType[];
  productsMutate: () => void;
  findAllProducts: () => Promise<ProductType[]>;
  createProduct: (payload: CreateProductPayload) => Promise<void>;
  updateProduct: (id: string, payload: UpdateProductPayload) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Promise<ProductType>;
  loading: boolean;
  pageOptions: PageOptions;
  search: string;
  setSearch: (s: string) => void;
  setPage: (p: number) => void;
  setPerPage: (n: number) => void;
}
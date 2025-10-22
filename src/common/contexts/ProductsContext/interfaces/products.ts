import { PageOptions } from "@/common/interface/paginate";

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
  // totalStock จาก API (optional)
  totalStock?: number;
}

export interface CreateProductDto {
  nameTh: string;
  nameEn?: string;
  descriptionTh?: string;
  descriptionEn?: string;
  unitType?: UnitTypeEnum;
  unit?: string;
  variant?: VariantType;
  productOptions?: ProductOptionType[];
}

export interface UpdateProductDto {
  nameTh?: string;
  nameEn?: string;
  descriptionTh?: string;
  descriptionEn?: string;
  unitType?: UnitTypeEnum;
  unit?: string;
  variant?: VariantType;
  productOptions?: ProductOptionType[];
}

export interface ProductsContextType {
  products: ProductType[];
  productsMutate: () => void;
  findAllProducts: () => Promise<ProductType[]>;
  createProduct: (payload: CreateProductDto) => Promise<void>;
  updateProduct: (id: string, payload: UpdateProductDto) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Promise<ProductType>;
  loading: boolean;
  pageOptions: PageOptions;
  search: string;
  setSearch: (s: string) => void;
  setPage: (p: number) => void;
  setPerPage: (n: number) => void;
}

// Prisma enum in schema.prisma:
// enum UnitType { piece weight volume }
export type UnitType = "piece" | "weight" | "volume";
export enum UnitTypeEnum {
  PIECE = "piece",
  WEIGHT = "weight",
  VOLUME = "volume",
}

// เพิ่ม type ของฟอร์มให้อยู่ใน context
export type ProductStatus = "active" | "inactive";
export type DiscountType = "no_discount" | "percent" | "fixed";

export interface ProductFormValues {
  p_name_th: string;
  p_name_en: string | null;
  p_description_th: string | null;
  p_description_en: string | null;

  imageIds: string[];
  detailImageIds: string[];

  unitType: UnitTypeEnum;
  unit: string;

  variant?: VariantType | undefined;

  productOptions: {
    upc: string;
    sku: string;
    price: number;
    inventory: { status: ProductStatus; stock: number };
    variantOption?: VariantOptionType | null;
  }[];

  status: ProductStatus;

  discountType: DiscountType;
  discountValue: number;

  categories: string[];
  tags: string[];
}
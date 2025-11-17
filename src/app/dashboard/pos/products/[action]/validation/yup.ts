import { ApiDiscountType, ApiInventoryStatus, UnitTypeEnum } from "@/common/contexts/ProductsContext/interfaces/products";
import * as Yup from "yup";

export const validationSchema = Yup.object({
  nameTh: Yup.string().trim().min(2, "กรอกอย่างน้อย 2 อักขระ").required("กรุณากรอกชื่อสินค้า (ไทย)"),
  nameEn: Yup.string().trim().min(2, "กรอกอย่างน้อย 2 อักขระ").nullable().notRequired(),

  descriptionTh: Yup.string().trim().min(2, "กรอกอย่างน้อย 2 อักขระ").nullable(),
  descriptionEn: Yup.string().trim().min(2, "กรอกอย่างน้อย 2 อักขระ").nullable().notRequired(),

  unitType: Yup.mixed<UnitTypeEnum>()
    .oneOf([UnitTypeEnum.PIECE, UnitTypeEnum.WEIGHT, UnitTypeEnum.VOLUME])
    .required("กรุณาเลือกประเภทหน่วยนับ"),
  unit: Yup.string().trim().min(1, "กรุณากรอกหน่วย").required("กรุณากรอกหน่วย"),

  categoryId: Yup.string().uuid("รูปแบบ UUID ไม่ถูกต้อง").nullable().notRequired(),
  branchId: Yup.string().uuid("รูปแบบ UUID ไม่ถูกต้อง").nullable().notRequired(),
  
  detailImageIds: Yup.array().of(
    Yup.mixed().test(
      'is-valid-file',
      'รูปภาพต้องเป็น UUID หรือ object ที่มี id',
      (value) => {
        if (!value) return true;
        if (typeof value === 'string') {
          return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
        }
        if (typeof value === 'object' && value !== null) {
          return 'id' in value && typeof value.id === 'string' && 
                 /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.id);
        }
        return false;
      }
    )
  ).nullable().notRequired(),
  
  tags: Yup.array().of(Yup.string()).nullable().notRequired(),

  isTaxInclusive: Yup.boolean().required("กรุณาระบุโหมดภาษี"),
  taxClassId: Yup.string().trim().required("กรุณาเลือกประเภทภาษี"),
  taxRate: Yup.number().min(0, "อัตราภาษีต้องไม่ติดลบ").typeError("กรุณากรอกอัตราภาษีเป็นตัวเลข"),

  variant: Yup.object().when("productOptions", {
    is: (productOptions: any) => Array.isArray(productOptions) && productOptions.length > 1,
    then: (schema) => Yup.object({
      nameTh: Yup.string().trim().min(1, "กรอกอย่างน้อย 1 อักขระ").required("กรุณากรอก ประเภทตัวแปร"),
      nameEn: Yup.string().trim().min(1, "กรอกอย่างน้อย 1 อักขระ").nullable().notRequired(),
    }).required("กรุณากรอกข้อมูลตัวแปร"),
    otherwise: (schema) => Yup.object().nullable().notRequired(),
  }),

  productOptions: Yup.array()
    .of(
      Yup.object({
        upc: Yup.string().trim().notRequired(),
        sku: Yup.string().trim().notRequired(),
        basePrice: Yup.number().min(0, "ราคาต้องไม่ติดลบ").typeError("กรุณากรอกราคาเป็นตัวเลข").required("กรุณากรอกราคา"),
        finalPrice: Yup.number().min(0, "ราคาต้องไม่ติดลบ").typeError("ราคาต้องเป็นตัวเลข"),
        pricePerUnit: Yup.number().min(0.01, "ต้องมากกว่า 0").typeError("กรุณากรอกหน่วยต่อราคาเป็นตัวเลข").required("กรุณากรอกหน่วยต่อราคา"),

        discountType: Yup.mixed<ApiDiscountType>()
          .oneOf(["none", "percentage", "fixed"])
          .required("กรุณาเลือกประเภทส่วนลด"),
        discountRate: Yup.number().min(0, "ส่วนลดต้องไม่ติดลบ").typeError("กรุณากรอกส่วนลดเป็นตัวเลข").required("กรุณากรอกส่วนลด"),

        thumbnailImageId: Yup.string().uuid("รูปภาพต้องเป็น UUID").nullable().notRequired(),
        
        thumbnailImageUrl: Yup.string().notRequired(),
        thumbnailOriginName: Yup.string().notRequired(),

        variantOption: Yup.mixed().when("$productOptions", {
          is: (productOptions: any) => Array.isArray(productOptions) && productOptions.length > 1,
          then: (schema) => schema.required("กรุณาเลือกตัวเลือกย่อย"),
          otherwise: (schema) => schema.notRequired(),
        }),

        // ✅ เพิ่ม lowStockThreshold
        lowStockThreshold: Yup.number()
          .min(0, "สินค้าเหลือน้อยต้องไม่ติดลบ")
          .typeError("กรุณากรอกจำนวนเป็นตัวเลข")
          .nullable()
          .notRequired(),

        inventory: Yup.object({
          status: Yup.mixed<ApiInventoryStatus>().oneOf(["active", "inactive", "deleted"]).required("กรุณาเลือกสถานะสต็อก"),
          stock: Yup.number().min(0, "สต็อกต้องไม่ติดลบ").typeError("กรุณากรอกจำนวนคงคลังเป็นตัวเลข").required("กรุณากรอกจำนวนคงคลัง"),
        }).required("กรุณากรอกข้อมูลสต็อก"),
      })
    )
    .min(1, "ต้องมีตัวเลือกสินค้าอย่างน้อย 1 รายการ")
    .required("กรุณาระบุตัวเลือกสินค้า"),
});
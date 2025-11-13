import { OptionType } from "@/common/components/base/BaseDropdown";
import { UnitTypeEnum } from "@/common/contexts/ProductsContext/interfaces/products";
import Avatar from "@mui/material/Avatar";

export const unitTypeOptions: OptionType[] = [
  { text: "ชิ้น", value: UnitTypeEnum.PIECE, icon: "IconPackage" },
  { text: "น้ำหนัก", value: UnitTypeEnum.WEIGHT, icon: "IconScale" },
  { text: "ปริมาตร", value: UnitTypeEnum.VOLUME, icon: "IconDroplet" },
];

export const weightUnitOptions: OptionType[] = [
  { text: "กรัม (g)", value: "g" },
  { text: "กิโลกรัม (kg)", value: "kg" },
];

export const volumeUnitOptions: OptionType[] = [
  { text: "มิลลิลิตร (ml)", value: "ml" },
  { text: "ลิตร (L)", value: "L" },
];

export const inventoryStatusOptions: OptionType[] = [
  { value: "active", text: "ใช้งาน" },
  { value: "inactive", text: "ไม่ใช้งาน" },
];

export const discountTypeOptions = [
  { value: "none", label: "ไม่มีส่วนลด" },
  { value: "percentage", label: "เปอร์เซ็นต์ %" },
  { value: "fixed", label: "ราคาคงที่" },
];

export const tagOptions = ["ใหม่ ✨", "ยอดนิยม 🔥", "ลดราคา 💸", "แนะนำ 👍"];
export const pieceUnitOptions = ["ชิ้น", "แท่ง", "เล่ม", "แก้ว", "ชาม", "จาน", "ถ้วย", "ขวด", "กล่อง", "ห่อ"];

export const languageTabs = [
  { label: "ไทย", icon: <Avatar src="/images/flag/icon-flag-th.svg" alt="TH" sx={{ width: 22, height: 22 }} /> },
  { label: "อังกฤษ", icon: <Avatar src="/images/flag/icon-flag-en.svg" alt="EN" sx={{ width: 22, height: 22 }} /> },
];

import { uniqueId } from "lodash";
import {
  IconCoffee,
  IconMilk,
  IconBottle,
  IconGlass,
  IconBowl,
  IconBread,
  IconCircle,
} from "@tabler/icons-react";
import { getTablerIcon } from "@/common/utils/icon/getTablerIcon";
import { NavGroupType } from "@/common/components/base/BaseSidebar/interface/sidebar";

const Menuitems: NavGroupType[] = [
  {
    navlabel: true,
    subheader: "หมวดหมู่",
  },
  {
    id: "all",
    title: "ทั้งหมด",
    icon: IconCircle,
    href: "/dashboard/pos/cashier",
  },
];

export const buildMenuItems = (categories: any[]): NavGroupType[] => {
  const menuItems: NavGroupType[] = [
    {
      navlabel: true,
      subheader: "หมวดหมู่",
    },
    {
      id: "all",
      title: "ทั้งหมด",
      href: "/dashboard/pos/cashier",
    },
  ];

  // ตรวจสอบว่า categories เป็น array และมีข้อมูล
  if (!Array.isArray(categories) || categories.length === 0) {
    return menuItems;
  }

  categories.forEach((cat) => {
    const parentIcon = cat.icon ? getTablerIcon(cat.icon) : IconCircle;
    
    const menuItem: any = {
      id: cat.id,
      title: cat.nameTh,
      icon: parentIcon,
      href: `/dashboard/pos/cashier?categoryId=${cat.id}`,
      color: cat.color || undefined,
    };

    if (cat.subCategories && cat.subCategories.length > 0) {
      menuItem.children = cat.subCategories.map((sub: any) => ({
        id: sub.id,
        title: sub.nameTh,
        icon: sub.icon ? getTablerIcon(sub.icon) : IconCircle,
        href: `/dashboard/pos/cashier?categoryId=${sub.id}`,
        color: sub.color || undefined,
      }));
    }

    menuItems.push(menuItem);
  });

  return menuItems;
};

export default Menuitems;

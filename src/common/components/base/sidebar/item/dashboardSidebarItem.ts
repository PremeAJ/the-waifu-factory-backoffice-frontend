import { uniqueId } from "lodash";

import {
  IconPoint,
  IconNotes,
  IconCalendar,
  IconCurrencyDollar,
  IconStar,
  IconUserCircle,
  IconChartLine,
  IconBox,
  IconShoppingCart,
  IconAperture,
  IconSettings,
  IconLockAccess,
  IconHome,
  IconCategory,
  IconBasket,
} from "@tabler/icons-react";
import { NavGroup } from "@/common/utils/types/layout/sidebar";
import { PageUrl } from "../../../../constants/pageUrl";

const dashboardSidebarItem: NavGroup[] = [
  {
    navlabel: true,
    subheader: "หน้าหลัก",
  },
  {
    id: uniqueId(),
    title: "หน้าหลัก",
    icon: IconHome,
    href: "/dashboard/home",
  },
  {
    navlabel: true,
    subheader: "ภาพรวม",
  },
  {
    id: uniqueId(),
    title: "แดชบอร์ดบริษัท",
    icon: IconAperture,
    href: PageUrl.DASHBOARD,
  },
  {
    id: uniqueId(),
    title: "ยอดขายสินค้า",
    icon: IconShoppingCart,
    href: "/dashboard/dashboards/ecommerce",
  },
  { navlabel: true, subheader: "POS" },
  {
    id: uniqueId(),
    title: "ออเดอร์",
    icon: IconNotes,
    href: "/pos/orders",
    children: [
      {
        id: uniqueId(),
        title: "ออเดอร์ใหม่",
        icon: IconPoint,
        href: "/pos/orders/new",
      },
      {
        id: uniqueId(),
        title: "ประวัติออเดอร์",
        icon: IconPoint,
        href: "/pos/orders/history",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "สินค้า / สต็อก",
    icon: IconBox,
    href: "/dashboard/pos/products",
    children: [
      {
        id: uniqueId(),
        title: "ขายหน้าร้าน",
        icon: IconShoppingCart,
        href: "/dashboard/pos/cashier",
      },
      {
        id: uniqueId(),
        title: "หมวดหมู่สินค้า",
        icon: IconCategory,
        href: "/dashboard/pos/categories",
      },
      {
        id: uniqueId(),
        title: "สินค้า",
        icon: IconBasket,
        href: "/dashboard/pos/products",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "รายงานขาย",
    icon: IconChartLine,
    href: "/pos/reports",
  },

  { navlabel: true, subheader: "CRM" },
  {
    id: uniqueId(),
    title: "ลูกค้า",
    icon: IconUserCircle,
    href: "/crm/customers",
  },
  {
    id: uniqueId(),
    title: "กิจกรรม/ติดตาม",
    icon: IconCalendar,
    href: "/crm/activities",
  },
  {
    id: uniqueId(),
    title: "แคมเปญ",
    icon: IconStar,
    href: "/crm/campaigns",
  },

  { navlabel: true, subheader: "HRM" },
  {
    id: uniqueId(),
    title: "พนักงาน",
    icon: IconUserCircle,
    href: "/hrm/employees",
  },
  {
    id: uniqueId(),
    title: "เวลาเข้างาน",
    icon: IconCalendar,
    href: "/hrm/attendance",
  },
  {
    id: uniqueId(),
    title: "เงินเดือน",
    icon: IconCurrencyDollar,
    href: "/hrm/payroll",
  },

  { navlabel: true, subheader: "ตั้งค่า/ระบบ" },
  {
    id: uniqueId(),
    title: "ตั้งค่าระบบ",
    icon: IconSettings,
    href: "/setting",
  },
  {
    id: uniqueId(),
    title: "สิทธิ์การใช้งาน",
    icon: IconLockAccess,
    href: "/settings/roles",
  },
];

export default dashboardSidebarItem;

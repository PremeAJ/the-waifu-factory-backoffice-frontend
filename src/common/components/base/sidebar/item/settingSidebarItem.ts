import { uniqueId } from "lodash";
import {
  IconBell,
  IconHelp,
  IconHome,
  IconKey,
  IconLock,
  IconMapPin,
  IconMessage,
  IconPalette,
  IconUser,
  IconWallet,
} from "@tabler/icons-react";
import { NavGroup } from "@/common/utils/types/layout/sidebar";
import { PageUrl } from "@/common/constants/pageUrl";

export const settingSidebarItem: NavGroup[] = [
  {
    navlabel: true,
    subheader: "บัญชี",
  },
  {
    id: uniqueId(),
    title: "บัญชีของฉัน",
    icon: IconUser,
    href: `${PageUrl.SETTING}/account/profile`,
    children: [
      {
        id: uniqueId(),
        title: "ข้อมูลส่วนตัว",
        icon: IconHome,
        href: `${PageUrl.SETTING}/account/profile`,
      },
      {
        id: uniqueId(),
        title: "ที่อยู่",
        icon: IconMapPin,
        href: `${PageUrl.SETTING}/account/address`,
      },
      {
        id: uniqueId(),
        title: "รหัสผ่าน",
        icon: IconKey,
        href: `${PageUrl.SETTING}/account/security`,
      },
    ],
  },
  {
    navlabel: true,
    subheader: "แอปพลิเคชัน",
  },
  {
    id: uniqueId(),
    title: "การแสดงผล",
    icon: IconPalette,
    href: `${PageUrl.SETTING}/appearance`,
  },
  {
    id: uniqueId(),
    title: "ความปลอดภัย",
    icon: IconLock,
    href: "/setting/account/security",
  },
  {
    id: uniqueId(),
    title: "การแจ้งเตือน",
    icon: IconBell,
    href: "/setting/notifications",
  },
  {
    navlabel: true,
    subheader: "บริการ",
  },
  {
    id: uniqueId(),
    title: "การชำระเงิน",
    icon: IconWallet,
    href: "/setting/payments",
  },
  {
    id: uniqueId(),
    title: "ช่วยเหลือ",
    icon: IconHelp,
    href: "/setting/help",
  },
  {
    id: uniqueId(),
    title: "ติดต่อเรา",
    icon: IconMessage,
    href: "/setting/support",
  },
];


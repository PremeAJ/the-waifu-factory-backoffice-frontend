import { uniqueId } from "lodash";
import {
  IconUser,
  IconMapPin,
  IconKey,
  IconDeviceMobile,
  IconPalette,
  IconLock,
  IconBell,
  IconWallet,
  IconHelp,
  IconMessage,
  IconHome
} from "@tabler/icons-react";
import { NavGroup } from "@/utils/types/layout/sidebar";

const Menuitems: NavGroup[] = [
  {
    navlabel: true,
    subheader: "บัญชี",
  },
  {
    id: uniqueId(),
    title: "บัญชีของฉัน",
    icon: IconUser,
    href: "/setting/account/profile",
    children: [
      {
        id: uniqueId(),
        title: "ข้อมูลส่วนตัว",
        icon: IconHome,
        href: "/setting/account/profile",
      },
      {
        id: uniqueId(),
        title: "ที่อยู่",
        icon: IconMapPin,
        href: "/setting/account/address",
      },
      {
        id: uniqueId(),
        title: "รหัสผ่าน",
        icon: IconKey,
        href: "/setting/account/security",
      },
      // {
      //   id: uniqueId(),
      //   title: "หมายเลขโทรศัพท์",
      //   icon: IconDeviceMobile,
      //   href: "/setting/account/phone",
      // },
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
    href: "/setting/appearance",
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

export default Menuitems;

import { uniqueId } from "lodash";
import {
  IconCoffee,
  IconMilk,
  IconBottle,
  IconGlass,
  IconBowl,
  IconBread,
  IconCake,
  IconCookie,
  IconIceCream,
  IconCircle,
} from "@tabler/icons-react";
import { NavGroup } from "@/utils/types/layout/sidebar";

const Menuitems: NavGroup[] = [
  {
    navlabel: true,
    subheader: "หมวดหมู่",
  },
  {
    id: "0",
    title: "ทั้งหมด",
    icon: IconCircle,
    href: "#",
  },
  {
    id: "1",
    title: "เครื่องดื่ม",
    icon: IconCoffee,
    href: "#",
    children: [
      {
        id: "11",
        title: "นม",
        icon: IconMilk,
        href: "#",
      },
      {
        id: "12",
        title: "โค้ก",
        icon: IconBottle,
        href: "#",
      },
      {
        id: "13",
        title: "เหล้า",
        icon: IconGlass,
        href: "#",
      },
    ],
  },
  {
    id: "2",
    title: "อาหารจานเดียว",
    icon: IconBowl,
    href: "#",
    children: [
      {
        id: "21",
        title: "กระเพรา",
        icon: IconBowl,
        href: "#",
      },
    ],
  },
  {
    id: "3",
    title: "ขนม",
    icon: IconBread,
    href: "#",
    children: [],
  },
];

export default Menuitems;

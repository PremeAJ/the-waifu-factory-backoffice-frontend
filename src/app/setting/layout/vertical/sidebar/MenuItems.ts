import { uniqueId } from "lodash";

import { IconPaint, IconUserCircle } from "@tabler/icons-react";
import { NavGroup } from "@/utils/types/layout/sidebar";

const Menuitems: NavGroup[] = [
  {
    navlabel: true,
    subheader: "Account",
  },

  {
    id: uniqueId(),
    title: "Profile",
    icon: IconUserCircle,
    href: "/setting/account/profile",
  },
  {
    navlabel: true,
    subheader: "Apps",
  },
  {
    id: uniqueId(),
    title: "Appearance",
    icon: IconPaint,
    href: "/setting/app/appearance",
  },
];

export default Menuitems;

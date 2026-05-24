import { uniqueId } from "lodash";

import {
  IconPoint,
  IconPhoto,
  IconUsers,
  IconTag,
  IconBrandDiscord,
  IconCreditCard,
  IconClipboardList,
} from "@tabler/icons-react";
import { PageUrl } from "@/common/constants/pageUrl";
import { NavGroupType } from "../interface/sidebar";

const dashboardSidebarItem: NavGroupType[] = [
  {
    navlabel: true,
    subheader: "Adoptables",
  },
  {
    id: uniqueId(),
    title: "Adoptables",
    icon: IconPhoto,
    href: PageUrl.ADOPTABLES,
    children: [
      {
        id: uniqueId(),
        title: "All",
        icon: IconPoint,
        href: PageUrl.ADOPTABLES,
      },
      {
        id: uniqueId(),
        title: "Pending",
        icon: IconPoint,
        href: PageUrl.ADOPTABLES_PENDING,
      },
      {
        id: uniqueId(),
        title: "Open",
        icon: IconPoint,
        href: PageUrl.ADOPTABLES_OPEN,
      },
      {
        id: uniqueId(),
        title: "Closed",
        icon: IconPoint,
        href: PageUrl.ADOPTABLES_CLOSED,
      },
    ],
  },

  {
    navlabel: true,
    subheader: "Users",
  },
  {
    id: uniqueId(),
    title: "Manage Users",
    icon: IconUsers,
    href: PageUrl.USERS,
  },

  {
    navlabel: true,
    subheader: "Master Data",
  },
  {
    id: uniqueId(),
    title: "Adoptable Tags",
    icon: IconTag,
    href: PageUrl.MASTER_ADOPTABLE_TAGS,
  },
  {
    id: uniqueId(),
    title: "Social Media",
    icon: IconBrandDiscord,
    href: PageUrl.MASTER_SOCIAL_MEDIA,
  },
  {
    id: uniqueId(),
    title: "Payment Methods",
    icon: IconCreditCard,
    href: PageUrl.MASTER_PAYMENT_METHODS,
  },

  {
    navlabel: true,
    subheader: "System",
  },
  {
    id: uniqueId(),
    title: "Audit Log",
    icon: IconClipboardList,
    href: PageUrl.AUDIT_LOG,
  },

];

export default dashboardSidebarItem;

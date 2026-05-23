import { uniqueId } from "lodash";

import {
  IconPoint,
  IconHome,
  IconPhoto,
  IconPalette,
  IconUsers,
  IconLockAccess,
  IconTag,
  IconBrandDiscord,
  IconCreditCard,
  IconSettings,
  IconListCheck,
  IconClockHour4,
  IconChartBar,
} from "@tabler/icons-react";
import { PageUrl } from "@/common/constants/pageUrl";
import { NavGroupType } from "../interface/sidebar";

const dashboardSidebarItem: NavGroupType[] = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconChartBar,
    href: PageUrl.DASHBOARD,
  },

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
    subheader: "Commissions",
  },
  {
    id: uniqueId(),
    title: "Commissions",
    icon: IconPalette,
    href: PageUrl.COMMISSIONS,
    children: [
      {
        id: uniqueId(),
        title: "All Posts",
        icon: IconPoint,
        href: PageUrl.COMMISSIONS,
      },
      {
        id: uniqueId(),
        title: "Open Slots",
        icon: IconListCheck,
        href: PageUrl.COMMISSIONS_OPENS,
      },
      {
        id: uniqueId(),
        title: "Queue",
        icon: IconClockHour4,
        href: PageUrl.COMMISSIONS_QUEUE,
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
    id: uniqueId(),
    title: "Roles & Permissions",
    icon: IconLockAccess,
    href: PageUrl.ROLES,
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
    title: "Settings",
    icon: IconSettings,
    href: PageUrl.SETTING,
  },
];

export default dashboardSidebarItem;

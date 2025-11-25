import { PageUrl } from "@/common/constants/pageUrl";
import { IconSettings,  IconBuildingCommunity, IconBuildingStore } from "@tabler/icons-react";
import { ElementType } from "react";

interface notificationType {
  avatar: string;
  title: string;
  subtitle: string;
}

const notifications: notificationType[] = [
  {
    avatar: "/images/profile/user-2.jpg",
    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
  {
    avatar: "/images/profile/user-3.jpg",
    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {
    avatar: "/images/profile/user-4.jpg",
    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {
    avatar: "/images/profile/user-5.jpg",
    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },
  {
    avatar: "/images/profile/user-6.jpg",
    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
  {
    avatar: "/images/profile/user-7.jpg",
    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {
    avatar: "/images/profile/user-8.jpg",
    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {
    avatar: "/images/profile/user-9.jpg",
    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },
];

interface ProfileType {
  href: string;
  title: string;
  subtitle: string;
  icon: string | ElementType; 
}
const profile: ProfileType[] = [
  {
    href: PageUrl.SETTING,
    icon: IconSettings,
    subtitle: "Account Settings",
    title: "Settings",
  },
  {
    href: PageUrl.DASHBOARD,
    icon: IconBuildingStore,
    subtitle: "Dashboard",
    title: "My Store",
  },
];


interface LinkType {
  href: string;
  title: string;
}

const pageLinks: LinkType[] = [
  {
    href: "/theme-pages/pricing",
    title: "Pricing Page",
  },
  {
    href: "/auth/auth1/login",
    title: "Authentication Design",
  },
  {
    href: "/auth/auth1/register",
    title: "Register Now",
  },
  {
    href: "/404",
    title: "404 Error Page",
  },
  {
    href: "/apps/note",
    title: "Notes App",
  },
  {
    href: "/apps/user-profile/profile",
    title: "User Application",
  },
  {
    href: "/apps/blog/post",
    title: "Blog Design",
  },
  {
    href: "/apps/ecommerce/checkout",
    title: "Shopping Cart",
  },
];

export { notifications, profile, pageLinks };

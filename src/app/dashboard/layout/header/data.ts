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

// apps dropdown
interface appsLinkType {
  href: string;
  title: string;
  subtext: string;
  avatar: string;
  color?: string; // เพิ่ม field สี (optional)
}

const appsLink: appsLinkType[] = [
  {
    href: "/apps/chats",
    title: "Chat Application",
    subtext: "New messages arrived",
    avatar: "/images/svgs/icon-dd-chat.svg",
    color: "#4CAF50", 
  },
  {
    href: "/poc/scanbarcode",
    title: "Barcode Scanner (ทดสอบ)",
    subtext: "Scan QR & Barcode",
    avatar: "/images/svgs/icon-scan-barcode.svg",
    color: "#2196F3",
  },
   {
    href: "/dashboard/pos/cashier",
    title: "Order",
    subtext: "Creat Order",
    avatar: "/images/svgs/icon-dd-cart.svg",
    color: "#FF9800", 
  },
  {
    href: "/apps/notes",
    title: "Notes App",
    subtext: "To-do and Daily tasks",
    avatar: "/images/svgs/icon-dd-invoice.svg",
    color: "#FFEB3B", 
  },
  {
    href: "/apps/calendar",
    title: "Calendar App",
    subtext: "Get dates",
    avatar: "/images/svgs/icon-dd-date.svg",
    color: "#F44336", 
  },
  {
    href: "/apps/contacts",
    title: "Contact Application",
    subtext: "2 Unsaved Contacts",
    avatar: "/images/svgs/icon-dd-mobile.svg",
  },
  {
    href: "/apps/tickets",
    title: "Tickets App",
    subtext: "Submit tickets",
    avatar: "/images/svgs/icon-dd-lifebuoy.svg",
  },
  {
    href: "/apps/email",
    title: "Email App",
    subtext: "Get new emails",
    avatar: "/images/svgs/icon-dd-message-box.svg",
  },
  {
    href: "/apps/blog/post",
    title: "Blog App",
    subtext: "added new blog",
    avatar: "/images/svgs/icon-dd-application.svg",
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

export { notifications, profile, pageLinks, appsLink };

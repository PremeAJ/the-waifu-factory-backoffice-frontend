interface appsLinkType {
  href: string;
  title: string;
  subtext: string;
  avatar: string;
  color?: string;
}

export const shortcutList: appsLinkType[] = [
  // {
  //   href: "/apps/chats",
  //   title: "Chat Application",
  //   subtext: "New messages arrived",
  //   avatar: "/images/svgs/icon-dd-chat.svg",
  //   color: "#4CAF50",
  // },
    {
    href: "/dashboard/home",
    title: "หน้าหลัก",
    subtext: "หน้าหลัก home",
    avatar: "/images/svgs/icon-home.svg",
    color: "#2196F3",
  },
  {
    href: "/poc/scanbarcode",
    title: "Barcode",
    subtext: "scan สแกน barcode barcode สินค้า",
    avatar: "/images/svgs/icon-scan-barcode.svg",
    color: "#2196F3",
  },
  {
    href: "/dashboard/pos/cashier",
    title: "Casheir",
    subtext: "Order ออร์เดอร์ casheir แคชเชียร์ ",
    avatar: "/images/svgs/icon-casheir.svg",
    color: "#FF9800",
  },
  // {
  //   href: "/apps/notes",
  //   title: "Notes App",
  //   subtext: "To-do and Daily tasks",
  //   avatar: "/images/svgs/icon-dd-invoice.svg",
  //   color: "#FFEB3B",
  // },
  // {
  //   href: "/apps/calendar",
  //   title: "Calendar App",
  //   subtext: "Get dates",
  //   avatar: "/images/svgs/icon-dd-date.svg",
  //   color: "#F44336",
  // },
  // {
  //   href: "/apps/contacts",
  //   title: "Contact Application",
  //   subtext: "2 Unsaved Contacts",
  //   avatar: "/images/svgs/icon-dd-mobile.svg",
  // },
  // {
  //   href: "/apps/tickets",
  //   title: "Tickets App",
  //   subtext: "Submit tickets",
  //   avatar: "/images/svgs/icon-dd-lifebuoy.svg",
  // },
  // {
  //   href: "/apps/email",
  //   title: "Email App",
  //   subtext: "Get new emails",
  //   avatar: "/images/svgs/icon-dd-message-box.svg",
  // },
  // {
  //   href: "/apps/blog/post",
  //   title: "Blog App",
  //   subtext: "added new blog",
  //   avatar: "/images/svgs/icon-dd-application.svg",
  // },
];

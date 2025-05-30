
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
  icon: string;
}
const profile: ProfileType[] = [
  {
    href: "/setting",
    title: "My Profile",
    subtitle: "Account Settings",
    icon: "/images/svgs/icon-account.svg",
  },
  {
    href: "/dashboard",
    title: "My Company",
    subtitle: "Dashboard",
    icon: "/images/svgs/icon-store.svg",
  },
];


export { notifications, profile };

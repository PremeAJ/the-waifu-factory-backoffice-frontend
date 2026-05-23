export enum PageUrl {
  AUTH_SIGN_IN = "/auth/sign-in",
  CALLBACK = "/auth/callback",
  DASHBOARD = "/dashboard",
  HOME = "/",
  PROFILE = "/profile",
  SETTING = "/setting",

  // Adoptables
  ADOPTABLES = "/dashboard/adoptables",
  ADOPTABLES_PENDING = "/dashboard/adoptables/pending",
  ADOPTABLES_OPEN = "/dashboard/adoptables/open",
  ADOPTABLES_CLOSED = "/dashboard/adoptables/closed",

  // Commissions
  COMMISSIONS = "/dashboard/commissions",
  COMMISSIONS_OPENS = "/dashboard/commissions/opens",
  COMMISSIONS_QUEUE = "/dashboard/commissions/queue",

  // Users & Roles
  USERS = "/dashboard/users",
  ROLES = "/dashboard/roles",

  // Master Data
  MASTER_ADOPTABLE_TAGS = "/dashboard/master/adoptable-tags",
  MASTER_SOCIAL_MEDIA = "/dashboard/master/social-media",
  MASTER_PAYMENT_METHODS = "/dashboard/master/payment-methods",
}

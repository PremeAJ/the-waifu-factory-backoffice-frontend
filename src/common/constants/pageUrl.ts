export enum PageUrl {
  AUTH_SIGN_IN = "/auth/sign-in",
  CALLBACK = "/auth/callback",
  DASHBOARD = "/",
  HOME = "/adoptables",
  PROFILE = "/profile",
  SETTING = "/setting",

  // Adoptables
  ADOPTABLES = "/adoptables",
  ADOPTABLES_PENDING = "/adoptables/pending",
  ADOPTABLES_OPEN = "/adoptables/open",
  ADOPTABLES_CLOSED = "/adoptables/closed",

  // Commissions
  COMMISSIONS = "/commissions",
  COMMISSIONS_OPENS = "/commissions/opens",
  COMMISSIONS_QUEUE = "/commissions/queue",

  // Users & Roles
  USERS = "/users",
  ROLES = "/roles",

  // Master Data
  MASTER_ADOPTABLE_TAGS = "/master/adoptable-tags",
  MASTER_SOCIAL_MEDIA = "/master/social-media",
  MASTER_PAYMENT_METHODS = "/master/payment-methods",
}

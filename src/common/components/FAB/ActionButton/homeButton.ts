import { PageActionConfig } from "./ActionButton";

const path = [
  "/dashboard/pos/cashier",
];

export const homeButtonRoute: PageActionConfig[] = path.map((pathname) => ({
  pathname,
  action: "home",
}));
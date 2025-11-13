import { PageActionConfig } from "./ActionButton";

const path = [
  "/dashboard/pos/cashier/category",
];

export const backButtonRoute: PageActionConfig[] = path.map((pathname) => ({
  pathname,
  action: "back",
}));
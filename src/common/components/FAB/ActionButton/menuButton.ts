import { PageActionConfig } from "./ActionButton";

const path = [
  "/dashboard",
  "/dashboard/pos/products",
  "/dashboard/pos/categories",
];

export const menuButtonRoute: PageActionConfig[] = path.map((pathname) => ({
  pathname,
  action: "menu",
}));


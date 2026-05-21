import { PageUrl } from "@/common/constants/pageUrl";
import { PageActionConfig } from "../ActionButton/ActionButton";

const path = [
  PageUrl.AUTH_SIGN_IN,
  // PageUrl.AUTH_SIGN_UP,
  PageUrl.CALLBACK,
  // PageUrl.FORGOT_PASSWORD,
  // PageUrl.MAIN,
  // PageUrl.PRICING,
  "/dashboard/pos/products/create/*",
  "/dashboard/pos/products/edit/*",
];

export const hideButtonRoute: PageActionConfig[] = path.map((pathname) => ({
  pathname,
  action: "hide",
}));

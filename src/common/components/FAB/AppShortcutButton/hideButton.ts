import { PageUrl } from "@/common/constants/pageUrl";
import { PageActionConfig } from "../ActionButton/ActionButton";

const path = [
  PageUrl.AUTH_SIGN_IN,
  PageUrl.CALLBACK,
  "/dashboard/pos/products/create/*",
  "/dashboard/pos/products/edit/*",
];

export const hideButtonRoute: PageActionConfig[] = path.map((pathname) => ({
  pathname,
  action: "hide",
}));

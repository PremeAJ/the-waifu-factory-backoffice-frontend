import { PageUrl } from "@/common/constants/pageUrl";
import { PageActionConfig } from "./ActionButton";

const path = [
  PageUrl.AUTH_SIGN_IN,
  // PageUrl.AUTH_SIGN_UP,
  PageUrl.CALLBACK,
  // PageUrl.FORGOT_PASSWORD,
  // PageUrl.MAIN,
  // PageUrl.PRICING,
];

export const hideButtonRoute: PageActionConfig[] = path.map((pathname) => ({
  pathname,
  action: "hide",
}));
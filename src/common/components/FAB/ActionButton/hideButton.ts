import { PageUrl } from "@/common/constants/pageUrl";
import { PageActionConfig } from "./ActionButton";

const path = [
  PageUrl.AUTH_SIGN_IN,
  PageUrl.CALLBACK,
];

export const hideButtonRoute: PageActionConfig[] = path.map((pathname) => ({
  pathname,
  action: "hide",
}));
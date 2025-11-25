import { PageUrl } from "@/common/constants/pageUrl";
import { PageActionConfig } from "../ActionButton/ActionButton";

const path = [
  '/dashboard/pos/products/*'
];

export const hideButtonRoute: PageActionConfig[] = path.map((pathname) => ({
  pathname,
  action: "hide",
}));
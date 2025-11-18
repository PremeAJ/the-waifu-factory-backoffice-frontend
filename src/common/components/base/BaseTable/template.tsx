import { IconPlus, IconEdit, IconPackage, IconTrash, IconEye } from "@tabler/icons-react";
import { ActionTemplate } from "./interface";

 export const defaultActionTemplates: Record<string, Partial<ActionTemplate>> = {
    create: {
      type: "create",
      icon: <IconPlus />,
      color: "success",
    },
    edit: {
      type: "edit",
      icon: <IconEdit />,
      color: "warning",
    },
    package:{
      type: "package",
      icon: <IconPackage/>,
      color: "success"
    },
    delete: {
      type: "delete",
      icon: <IconTrash />,
      color: "error",
    },
    view: {
      type: "view",
      icon: <IconEye />,
      color: "info",
    },
  };
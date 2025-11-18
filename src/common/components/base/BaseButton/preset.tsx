import { IconCircleDashedPlus, IconDeviceFloppy, IconPencil, IconX } from "@tabler/icons-react";
import { PresetButtonConfig, PresetType } from "./interface"

export const presetMap: Record<PresetType, PresetButtonConfig> = {
  default: {
    label: "Button",
    color: "primary",
    variant: "contained",
    size: "large",
  },
  save: {
    label: "Save",
    color: "primary",
    variant: "contained",
    size: "large",
    icon: <IconDeviceFloppy size={20} />,
  },
  cancel: {
    label: "Cancel",
    color: "error",
    variant: "text",
    size: "large",
    icon: <IconX size={20} />,
  },
  edit: {
    label: "Edit",
    color: "primary",
    variant: "text",
    size: "large",
    icon: <IconPencil size={20} />,
  },
  add: {
    label: "Add",
    color: "primary",
    variant: "contained",
    size: "large",
    icon: <IconCircleDashedPlus size={20} />,
  },
};
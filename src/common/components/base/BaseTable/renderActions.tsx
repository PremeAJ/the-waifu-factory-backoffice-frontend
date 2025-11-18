import { ActionTemplate, RenderActionButtonsProps } from "./interface";
import { Box, IconButton } from "@mui/material";
import { defaultActionTemplates } from "./template";
import BaseTooltip from "../BaseTooltip";
import Link from "next/link";

export const renderActionButtons = ({
  item,
  actionTemplates,
  actions,
}: RenderActionButtonsProps) => {
  if (actionTemplates && actionTemplates.length > 0) {
    return (
      <>
        {actionTemplates.map((tpl, idx) => {
          const defaults = tpl.type ? defaultActionTemplates[tpl.type] || {} : {};
          const resolved: ActionTemplate = {
            ...(defaults as ActionTemplate),
            ...(tpl as ActionTemplate),
          };
          const isHidden = typeof resolved.hide === "function" ? resolved.hide(item) : resolved.hide;
          if (isHidden) return null;
          const disabled = resolved.disabled ? resolved.disabled(item) : false;
          const tooltipText =
            typeof resolved.tooltip === "function" ? resolved.tooltip(item) : resolved.tooltip || "";
          const href = typeof resolved.href === "function" ? resolved.href(item) : resolved.href;

          return (
            <Box key={resolved.key ?? `${resolved.type ?? "action"}-${idx}`} sx={{ display: "inline-flex", mx: 0.5 }}>
              <BaseTooltip title={tooltipText}>
                <span>
                  <IconButton
                    size="small"
                    disabled={disabled}
                    {...(!disabled && href ? { component: Link, href } : {})}
                    onClick={!href ? () => resolved.onClick?.(item) : undefined}
                    color={resolved.color as any}
                  >
                    {resolved.icon ?? <span style={{ fontSize: 12 }}>{resolved.type}</span>}
                  </IconButton>
                </span>
              </BaseTooltip>
            </Box>
          );
        })}
      </>
    );
  }

  if (actions) return actions(item);
  return null;
};

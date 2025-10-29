"use client";

import React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import { IconCopy, IconX, IconBug } from "@tabler/icons-react";
import BaseFloatingButton, { FloatingButtonPosition } from "@/common/components/base/BaseFloatingButton";

interface BaseDebugProps {
  data: any;
  title?: string;
  openInitially?: boolean;
}

const BaseDebug: React.FC<BaseDebugProps> = ({ data, title = "Debug JSON", openInitially = false }) => {
  const [open, setOpen] = React.useState<boolean>(openInitially);
  const json = React.useMemo(() => (data === undefined ? "undefined" : JSON.stringify(data, null, 2)), [data]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <BaseFloatingButton
        position={FloatingButtonPosition.BOTTOM_LEFT}
        icon={<IconBug size={20} />}
        onClick={() => setOpen(true)}
        sx={{ zIndex: 1999 }}
      />

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" aria-label="debug-dialog">
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {title}
          <IconButton size="small" onClick={() => setOpen(false)}>
            <IconX size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ p: 0 }}>
            <Stack direction="row" justifyContent="flex-end" spacing={1} mb={1}>
              <Button size="small" variant="outlined" startIcon={<IconCopy size={16} />} onClick={handleCopy}>
                Copy
              </Button>
            </Stack>

            <Box
              component="pre"
              sx={{
                bgcolor: "background.paper",
                borderRadius: 1,
                p: 2,
                overflow: "auto",
                maxHeight: "60vh",
                fontSize: "0.85rem",
              }}
            >
              {json}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BaseDebug;

"use client";

import React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import { IconCopy, IconX, IconBug } from "@tabler/icons-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
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

  // if (process.env.NODE_ENV === "production") {
  //   return null;
  // }

  return (
    <>
      <BaseFloatingButton
        position={FloatingButtonPosition.CENTER_RIGHT}
        icon={<IconBug size={20} />}
        onClick={() => setOpen(true)}
        sx={{ zIndex: 1999 }}
        size="small"
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

            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: "4px",
                margin: 0,
                maxHeight: "60vh",
              }}
            >
              {json}
            </SyntaxHighlighter>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BaseDebug;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

type DialogSuccessProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  content?: string;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: "primary" | "error" | "success" | "info" | "warning";
};

export const DialogSuccess = ({
  open,
  onClose,
  onConfirm,
  title = "Success",
  content = "Operation completed successfully.",
  cancelText = "Close",
  confirmText = "OK",
  confirmColor = "primary",
}: DialogSuccessProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {cancelText}
        </Button>
        {onConfirm && (
          <Button color={confirmColor} variant="contained" onClick={onConfirm}>
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

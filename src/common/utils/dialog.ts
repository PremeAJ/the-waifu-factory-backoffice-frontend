type DialogPayload = { message: string; title?: string; showDetails?: boolean; disableBackdropClose?: boolean; callback?: string };

let _showError: ((p: DialogPayload) => void) | null = null;
let _showSuccess: ((p: DialogPayload) => void) | null = null;
let _hideDialog: (() => void) | null = null;

export function registerDialogHandlers(handlers: {
  showError: (p: DialogPayload) => void;
  showSuccess: (p: DialogPayload) => void;
  hideDialog: () => void;
}) {
  _showError = handlers.showError;
  _showSuccess = handlers.showSuccess;
  _hideDialog = handlers.hideDialog;
}

export function unregisterDialogHandlers() {
  _showError = _showSuccess = _hideDialog = null;
}

export const showError = (payload: DialogPayload) => _showError ? _showError(payload) : console.warn("DialogHandler not ready", payload);
export const showSuccess = (payload: DialogPayload) => _showSuccess ? _showSuccess(payload) : console.warn("DialogHandler not ready", payload);
export const hideDialog = () => _hideDialog ? _hideDialog() : undefined;
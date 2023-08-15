import { useState } from "react";

/**
 *
 * @returns methods used for implementing dialog (i.e. isOpen, setCloseDialog, setOpenDialog)
 */
export const useDialogState = (initialState?: boolean) => {
  const [isVisible, setOpen] = useState(initialState ?? false);

  const close = () => setOpen(false);
  const open = () => setOpen(true);

  return { isVisible, open, close };
};

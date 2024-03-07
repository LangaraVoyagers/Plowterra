import { Alert, Snackbar } from "@mui/material";
import React, { createContext, useContext } from "react";

export const AlertContext = createContext<{
  showAlert: (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => void;
} | null>(null);

type AlertProviderProps = {
  children: React.ReactNode;
};

export interface SnackbarMessage {
  message: string;
  key: number;
  severity: "success" | "error" | "warning" | "info";
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>(
    []
  );
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<
    SnackbarMessage | undefined
  >(undefined);

  const showAlert = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackPack((prev) => [
      ...prev,
      { message, key: new Date().getTime(), severity },
    ]);
  };

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  return (
    <AlertContext.Provider
      value={{
        showAlert,
      }}
    >
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={messageInfo ? messageInfo.severity : undefined}
          variant="standard"
          sx={{ width: "100%" }}
        >
          {messageInfo ? messageInfo.message : undefined}
        </Alert>
      </Snackbar>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (context === null) {
    throw new Error("AlertContext must be used within a AlertProvider");
  }

  return context;
};

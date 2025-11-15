import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <Snackbar
        open={!isOnline}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          You have no internet connection!
        </Alert>
      </Snackbar>
    </>
  );
};

export default NetworkStatus;

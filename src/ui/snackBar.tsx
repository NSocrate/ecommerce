"use client";
import { Alert, AlertProps } from "@mui/material";
import { forwardRef } from "react";

export const SnackAlert = forwardRef<HTMLDivElement, AlertProps>(
  function SnackAlert(props, ref) {
    return <Alert elevation={6} ref={ref} {...props} />;
  }
);

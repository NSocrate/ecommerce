"use client";
import { SnackAlert } from "@/ui/snackBar";
import { LoadingButton } from "@mui/lab";
import {
  FormControl,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Ajouter } from "../actions";
export default function AddForm() {
  const { pending } = useFormStatus();
  const [formState, formAction] = useFormState(Ajouter, {
    ok: false,
    message: "",
    fieldValues: {
      designation: "",
    },
    errors: undefined,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [snackBarInfo, setSnackBarInfo] = useState({ ok: false, msg: "" });
  const handleChose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarInfo({ ok: false, msg: "" });
  };
  useEffect(() => {
    if (formState.ok) {
      formRef.current?.reset();
      setSnackBarInfo({ ok: formState.ok, msg: formState.message });
    } else {
      setSnackBarInfo({ ok: formState.ok, msg: formState.message });
    }
  }, [formState]);
  return (
    <>
      <Paper
        sx={{
          padding: "1.5rem",
          borderRadius: "0.5rem",
          background: "#ffffff6e",
        }}
        elevation={1}
      >
        <form ref={formRef} action={formAction}>
          <Stack spacing={2}>
            <Typography variant="h6" color={"text.secondary"} gutterBottom>
              Information sur l&apos;option
            </Typography>

            <FormControl fullWidth>
              <TextField
                label="Option"
                type="text"
                name="designation"
                required
                fullWidth
                defaultValue={formState.fieldValues.designation}
                error={Boolean(formState.errors?.designation)}
                helperText={
                  Boolean(formState.errors?.designation)
                    ? formState.errors?.designation
                    : "ex. EB, Sociale, etc."
                }
              />
            </FormControl>
            <LoadingButton
              variant="contained"
              type="submit"
              disabled={pending}
              loading={pending}
            >
              Sauvegarder
            </LoadingButton>
          </Stack>
        </form>
      </Paper>
      <Snackbar
        open={Boolean(snackBarInfo.msg)}
        autoHideDuration={6000}
        onClose={handleChose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <SnackAlert
          onClose={handleChose}
          severity={snackBarInfo.ok ? "success" : "error"}
        >
          {snackBarInfo.msg}
        </SnackAlert>
      </Snackbar>
    </>
  );
}

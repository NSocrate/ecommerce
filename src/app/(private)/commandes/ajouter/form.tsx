"use client";
import { SnackAlert } from "@/ui/snackBar";
import { LoadingButton } from "@mui/lab";
import { Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Ajouter } from "../actions";
import { useRouter } from "next/navigation";
export default function AddForm() {
  const { pending } = useFormStatus();
  const [formState, formAction] = useFormState(Ajouter, {
    ok: false,
    message: "",
    fieldValues: {
      id: undefined,
      client: "",
    },
    errors: undefined,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [snackBarInfo, setSnackBarInfo] = useState({ ok: false, msg: "" });
  const router = useRouter();
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
      router.push(`/commandes/${formState.fieldValues.id}`);
    } else {
      setSnackBarInfo({ ok: formState.ok, msg: formState.message });
    }
  }, [formState, router]);
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
              Detail
            </Typography>

            <Stack spacing={2} direction={"row"}>
              <TextField
                label="client"
                name="client"
                required
                defaultValue={formState.fieldValues.client}
                // InputProps={{ readOnly: true }}
                fullWidth
                error={Boolean(formState.errors?.client)}
                helperText={
                  Boolean(formState.errors?.client)
                    ? formState.errors?.client
                    : "Inserer les noms du client"
                }
              />
            </Stack>
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

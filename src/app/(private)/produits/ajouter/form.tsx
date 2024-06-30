"use client";
import { SnackAlert } from "@/ui/snackBar";
import { LoadingButton } from "@mui/lab";
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Ajouter } from "../actions";
export default function AddForm({
  categories,
}: {
  categories: {
    id: number;
    designation: string;
  }[];
}) {
  const { pending } = useFormStatus();
  const [formState, formAction] = useFormState(Ajouter, {
    ok: false,
    message: "",
    fieldValues: {
      designation: "",
      quantite: 0,
      prix: 0,
      categorieId: 0,
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
              Detail
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="categorie">Catégorie</InputLabel>
              <Select
                labelId="categorie"
                id="categorie"
                label="Categorie"
                defaultValue={formState.fieldValues.categorieId}
                required
                name="categorieId"
                error={Boolean(formState.errors?.categorieId)}
              >
                {categories.map((categorie) => (
                  <MenuItem key={categorie.id} value={categorie.id}>
                    {categorie.designation}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Sélectionnez une catégorie</FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Designation"
                name="designation"
                required
                fullWidth
                error={Boolean(formState.errors?.designation)}
                helperText={
                  Boolean(formState.errors?.designation)
                    ? formState.errors?.designation
                    : "Inserer une designation"
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Prix"
                name="prix"
                required
                defaultValue={formState.fieldValues.prix}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      Unité Monnétaire
                    </InputAdornment>
                  ),
                  inputProps: {
                    step: 0.1,
                  },
                }}
                fullWidth
                error={Boolean(formState.errors?.prix)}
                helperText={
                  Boolean(formState.errors?.prix)
                    ? formState.errors?.prix
                    : "Inserer un prix"
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Quantite"
                name="quantite"
                required
                defaultValue={formState.fieldValues.quantite}
                // InputProps={{ readOnly: true }}
                fullWidth
                error={Boolean(formState.errors?.quantite)}
                helperText={
                  Boolean(formState.errors?.quantite)
                    ? formState.errors?.quantite
                    : "Inserer une quantite"
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





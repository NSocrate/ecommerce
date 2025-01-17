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
      title: "",
      price: 0,
      description: "",
      image: "",
      category: "",
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
              Information sur l&apos;article
            </Typography>

            <FormControl fullWidth>
              <TextField
                label="Designation"
                type="text"
                name="title"
                required
                fullWidth
                defaultValue={formState.fieldValues.title}
                error={Boolean(formState.errors?.title)}
                helperText={
                  Boolean(formState.errors?.title)
                    ? formState.errors?.title
                    : "Inserez la designation de l'article"
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Prix"
                type="text"
                name="price"
                required
                fullWidth
                defaultValue={formState.fieldValues.price}
                error={Boolean(formState.errors?.price)}
                helperText={
                  Boolean(formState.errors?.price)
                    ? formState.errors?.price
                    : "Inserez le prix"
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Description"
                type="text"
                name="description"
                required
                fullWidth
                defaultValue={formState.fieldValues.description}
                error={Boolean(formState.errors?.description)}
                helperText={
                  Boolean(formState.errors?.description)
                    ? formState.errors?.description
                    : "Inserez la description de l'article"
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Categorie"
                type="text"
                name="category"
                required
                fullWidth
                defaultValue={formState.fieldValues.category}
                error={Boolean(formState.errors?.category)}
                helperText={
                  Boolean(formState.errors?.title)
                    ? formState.errors?.title
                    : "Inserez la catégorie de l'article"
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Image"
                type="text"
                name="image"
                required
                fullWidth
                defaultValue={formState.fieldValues.image}
                error={Boolean(formState.errors?.image)}
                helperText={
                  Boolean(formState.errors?.image)
                    ? formState.errors?.image
                    : "Inserez l'url contenant l'image de l'article"
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

"use client";
import { SnackAlert } from "@/ui/snackBar";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  AjouterProduit,
  Modifier,
  Supprimer,
  FormStateProduct,
} from "../actions";
import { useRouter } from "next/navigation";
import { getCleanLink } from "@/app/lib/functions";
import Data from "@/ui/data";
import AddCircle from "@mui/icons-material/AddCircle";
import { SupprimerProduit } from "../../produits/actions";
const title = "Catégories";
export default function EditForm({
  data,
}: {
  data: {
    id: number;
    designation: string;
    produit: {
      id: number;
      designation: string;
      quantite: number;
      prix: number;
    }[];
  } | null;
}) {
  const { pending } = useFormStatus();
  const [formStateProduct, formActionProduct] = useFormState(AjouterProduit, {
    ok: false,
    message: "",
    fieldValues: {
      designation: "",
      quantite: 0,
      prix: 0,
    },
    errors: undefined,
  });
  const [formState, formAction] = useFormState(Modifier, {
    ok: false,
    message: "",
    fieldValues: {
      designation: data?.designation as string,
    },
    errors: undefined,
  });
  const columns = [
    {
      field: "designation",
      headerName: "Produit",
      flex: 1,
    },
    {
      field: "quantite",
      headerName: "Quantité",
      flex: 1,
    },
    {
      field: "prix",
      headerName: "Prix",
      flex: 1,
    },
  ];
  const theme = useTheme();
  const formRef = useRef<HTMLFormElement>(null);
  const formProductRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
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
    if (formStateProduct.ok) {
      formProductRef.current?.reset();
      setSnackBarInfo({
        ok: formStateProduct.ok,
        msg: formStateProduct.message,
      });
      setOpenProductDialog(false);
    } else {
      setSnackBarInfo({
        ok: formStateProduct.ok,
        msg: formStateProduct.message,
      });
    }
  }, [formState, formStateProduct]);
  return (
    <Stack rowGap={2}>
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
            <input type="number" name="id" defaultValue={data?.id} hidden />
            <Stack spacing={2} direction={"row"}>
              <TextField
                label="Designation"
                name="designation"
                required
                defaultValue={formState.fieldValues.designation}
                // InputProps={{ readOnly: true }}
                fullWidth
                error={Boolean(formState.errors?.designation)}
                helperText={
                  Boolean(formState.errors?.designation)
                    ? formState.errors?.designation
                    : "Inserer une designation"
                }
              />
              <Stack spacing={2}>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  disabled={pending}
                  loading={pending}
                >
                  Sauvegarder
                </LoadingButton>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                >
                  Supprimer
                </Button>
              </Stack>
              <Button
                variant="contained"
                color="info"
                startIcon={<AddCircle />}
                onClick={() => setOpenProductDialog(true)}
              >
                Ajouter un produit
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
      <Data
        columns={columns}
        formAction={SupprimerProduit}
        rows={data?.produit}
        route="produits"
        tag="designation"
      />
      <Dialog
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
      >
        <DialogTitle id="suppression">Suppression</DialogTitle>
        <DialogContent>
          <DialogContentText id="supprission-description">
            Êtes-vous sûr de supprimer la{" "}
            {title.substring(0, title.length - 1).toLowerCase()} :{" "}
            {data?.designation} ?
          </DialogContentText>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
              }}
            >
              Non (Annuler)
            </Button>
            <form
              action={async (e: FormData) => {
                if (await Supprimer(e)) {
                  setSnackBarInfo({ ok: true, msg: "Suppression reussie" });
                  router.replace(`/${getCleanLink(title)}`);
                } else {
                  setSnackBarInfo({ ok: true, msg: "Echec Suppression" });
                }
                setOpenDialog(false);
              }}
              ref={formRef}
            >
              <input type="text" name="id" value={data?.id} hidden />
              <LoadingButton
                type="submit"
                loading={pending}
                autoFocus
                sx={{ color: theme.palette.error.main }}
              >
                Oui (Suppimer)
              </LoadingButton>
            </form>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        fullWidth
        aria-labelledby="Ajouter un produit"
        aria-describedby="Formulaire d'ajout de produit"
        open={openProductDialog}
        onClose={() => {
          setOpenProductDialog(false);
        }}
      >
        <DialogTitle id="form-title">Ajouter un produit</DialogTitle>
        <DialogContent>
          <DialogContentText id="form-description">
            <form ref={formProductRef} action={formActionProduct}>
              <Stack spacing={2}>
                <Typography variant="h6" color={"text.secondary"} gutterBottom>
                  Detail
                </Typography>
                <input
                  type="number"
                  name="categorie"
                  defaultValue={data?.id}
                  hidden
                />
                <Stack spacing={2} direction={"row"}>
                  <TextField
                    label="Designation"
                    name="designation"
                    required
                    defaultValue={formStateProduct.fieldValues.designation}
                    fullWidth
                    error={Boolean(formState.errors?.designation)}
                    helperText={
                      Boolean(formState.errors?.designation)
                        ? formState.errors?.designation
                        : "Inserer une designation"
                    }
                  />
                </Stack>
                <Stack spacing={2} direction={"row"}>
                  <TextField
                    label="Quantite"
                    name="quantite"
                    required
                    defaultValue={formStateProduct.fieldValues.quantite}
                    fullWidth
                    error={Boolean(formStateProduct.errors?.quantite)}
                    helperText={
                      Boolean(formStateProduct.errors?.quantite)
                        ? formStateProduct.errors?.quantite
                        : "Inserer une quantité"
                    }
                  />
                </Stack>
                <Stack spacing={2} direction={"row"}>
                  <TextField
                    label="Prix"
                    name="prix"
                    type="number"
                    required
                    defaultValue={formStateProduct.fieldValues.prix}
                    InputProps={{
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
                    error={Boolean(formStateProduct.errors?.prix)}
                    helperText={
                      Boolean(formStateProduct.errors?.prix)
                        ? formStateProduct.errors?.designation
                        : "Inserer un prix"
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
          </DialogContentText>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenProductDialog(false);
              }}
            >
              Annuler (Fermer)
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

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
    </Stack>
  );
}

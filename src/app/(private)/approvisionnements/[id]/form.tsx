"use client";
import { SnackAlert } from "@/ui/snackBar";
import { LoadingButton } from "@mui/lab";
import { formatDate } from "date-fns/format";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { getCleanLink } from "@/app/lib/functions";
import { Modifier, SupprimerApprov } from "../actions";
const title = "Produits";
export default function EditForm({
  data,
  produits,
}: {
  data: {
    id: number;
    quantite: number;
    prix: number;
    produit: {
      id: number;
      designation: string;
    };
  } | null;
  produits: {
    id: number;
    designation: string;
  }[];
}) {
  const { pending } = useFormStatus();
  const [formState, formAction] = useFormState(Modifier, {
    ok: false,
    message: "",
    fieldValues: {
      quantite: data?.quantite as number,
      prix: data?.prix as number,
      produitId: data?.produit.id as number,
    },
    errors: undefined,
  });

  const theme = useTheme();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
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
            <input name="id" defaultValue={data?.id} hidden />
            <FormControl fullWidth>
              <InputLabel id="categorie">Produit</InputLabel>
              <Select
                labelId="produit"
                id="produit"
                label="produit"
                defaultValue={formState.fieldValues.produitId}
                required
                name="produitId"
                error={Boolean(formState.errors?.produitId)}
              >
                {produits.map((produit) => (
                  <MenuItem key={produit.id} value={produit.id}>
                    {produit.designation}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Sélectionnez une catégorie</FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Prix"
                name="prix"
                required
                defaultValue={formState.fieldValues.prix}
                fullWidth
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
            Êtes-vous sûr de supprimer l&apos;approvisionnement de
            {title.substring(0, title.length - 1).toLowerCase()} :{" "}
            {data?.produit.designation} ?
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
                if (await SupprimerApprov(e)) {
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

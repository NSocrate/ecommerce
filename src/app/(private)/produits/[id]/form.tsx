"use client";
import { SnackAlert } from "@/ui/snackBar";
import { LoadingButton } from "@mui/lab";
import { formatDate } from "date-fns/format";
import {
  Box,
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
import { Approvisionner, Modifier, SupprimerProduit } from "../actions";
import Data from "@/ui/data";
import AddCircle from "@mui/icons-material/AddCircle";
import { SupprimerApprov } from "../../approvisionnements/actions";
const title = "Produits";
export default function EditForm({
  data,
  categories,
}: {
  data: {
    id: number;
    designation: string;
    quantite: number;
    prix: number;
    categorieId: number;
    Approvisionnement: {
      id: number;
      produitId: number;
      quantite: number;
      prix: number;
      date: Date;
    }[];
    ligneCommande: {
      id: number;
      prix: number;
      produitId: number;
      quantite: number;
      commandeId: number;
    }[];
  } | null;
  categories: {
    id: number;
    designation: string;
  }[];
}) {
  const { pending } = useFormStatus();
  const [formState, formAction] = useFormState(Modifier, {
    ok: false,
    message: "",
    fieldValues: {
      designation: data?.designation as string,
      quantite: data?.quantite as number,
      prix: data?.prix as number,
      categorieId: data?.categorieId as number,
    },
    errors: undefined,
  });
  const [formStateApprov, formActionApprov] = useFormState(Approvisionner, {
    ok: false,
    message: "",
    fieldValues: {
      quantite: 0,
      prix: 0,
    },
    errors: undefined,
  });
  const columnsLignes = [
    {
      field: "COM",
      headerName: "commandeId",
      flex: 1,
    },
    {
      field: "quantite",
      headerName: "Quantite",
      flex: 1,
    },
    {
      field: "prix",
      headerName: "Prix",
      flex: 1,
    },
  ];
  const columnsApprov = [
    {
      field: "quantite",
      headerName: "Quantite",
      flex: 1,
    },
    {
      field: "prix",
      headerName: "Prix",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
  ];

  const theme = useTheme();
  const formRef = useRef<HTMLFormElement>(null);
  const formApprovRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [openApprovDialog, setOpenApprovDialog] = useState(false);
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
    if (formStateApprov.ok) {
      formApprovRef.current?.reset();
      setSnackBarInfo({ ok: formStateApprov.ok, msg: formStateApprov.message });
      setOpenApprovDialog(false);
    } else {
      setSnackBarInfo({ ok: formStateApprov.ok, msg: formStateApprov.message });
    }
  }, [formState, formStateApprov]);
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
            <Stack spacing={2}>
              <Typography variant="h6" color={"text.secondary"} gutterBottom>
                Detail
              </Typography>
              <input type="number" defaultValue={data?.id} name="id" hidden />
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
                  defaultValue={formState.fieldValues.designation}
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
              <Stack spacing={2} direction={"row"}>
                <FormControl fullWidth>
                  <TextField
                    label="Prix"
                    name="prix"
                    required
                    defaultValue={formState.fieldValues.prix}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          $
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
              </Stack>
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
                onClick={() => setOpenApprovDialog(true)}
              >
                Approvisionner
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
      <Stack
        gap={1}
        direction={"row"}
        width={"100%"}
        flexWrap={{ sm: "wrap", md: "nowrap" }}
      >
        <Box>
          <Typography color={"text.secondary"}>
            Les toutes les commandes de ce produit
          </Typography>
          <Data
            columns={columnsLignes}
            action={false}
            rows={data?.ligneCommande}
            route="produits"
          />
        </Box>
        <Box>
          <Typography color={"text.secondary"}>
            Les tous les approvisionnements de ce produit
          </Typography>
          <Data
            columns={columnsApprov}
            formAction={SupprimerApprov}
            rows={data?.Approvisionnement.map((approv) => ({
              ...approv,
              date: formatDate(approv.date, "dd/MM/yyy"),
            }))}
            subTag="l'approvisionnement du produit "
            tag="produitId"
            route="produits"
            update={false}
          />
        </Box>
      </Stack>
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
            Êtes-vous sûr de supprimer le
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
                if (await SupprimerProduit(e)) {
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
        open={openApprovDialog}
        onClose={() => {
          setOpenApprovDialog(false);
        }}
      >
        <DialogTitle id="form-title">
          Approvisionner &quot;{data?.designation}&quot;
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="form-description">
            <form ref={formApprovRef} action={formActionApprov}>
              <Stack spacing={2}>
                <Typography variant="h6" color={"text.secondary"} gutterBottom>
                  Detail
                </Typography>
                <input
                  type="number"
                  name="produit"
                  defaultValue={data?.id}
                  hidden
                />
                <Stack spacing={2} direction={"row"}>
                  <TextField
                    label="Quantite"
                    name="quantite"
                    type="number"
                    required
                    defaultValue={formStateApprov.fieldValues.quantite}
                    fullWidth
                    error={Boolean(formStateApprov.errors?.quantite)}
                    helperText={
                      Boolean(formStateApprov.errors?.quantite)
                        ? formStateApprov.errors?.quantite
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
                    defaultValue={formStateApprov.fieldValues.prix}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          $
                        </InputAdornment>
                      ),
                      inputProps: {
                        step: 0.1,
                      },
                    }}
                    fullWidth
                    error={Boolean(formStateApprov.errors?.quantite)}
                    helperText={
                      Boolean(formStateApprov.errors?.quantite)
                        ? formStateApprov.errors?.quantite
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
                setOpenApprovDialog(false);
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

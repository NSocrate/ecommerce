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
import PrintIcon from "@mui/icons-material/Print";
import { AjouterLigne, Modifier, Supprimer, SupprimerLigne } from "../actions";
import { useRouter } from "next/navigation";
import { getCleanLink } from "@/app/lib/functions";
import Data from "@/ui/data";
import AddCircle from "@mui/icons-material/AddCircle";
import Link from "next/link";
const title = "Commandes";
export default function EditForm({
  data,
  produits,
}: {
  data: {
    id: number;
    client: string | null;
    date: Date;
    ligneCommande: {
      id: number;
      prix: number;
      produitId: number;
      quantite: number;
      commandeId: number;
      produit: {
        id: number;
        designation: string;
        quantite: number;
        prix: number;
        categorieId: number;
      };
    }[];
  } | null;
  produits:
    | {
        id: number;
        designation: string;
        quantite: number;
        prix: number;
        categorieId: number;
        categorie: {
          id: number;
          designation: string;
        };
      }[]
    | null;
}) {
  const { pending } = useFormStatus();
  const [formStateLigne, formActionLigne] = useFormState(AjouterLigne, {
    ok: false,
    message: "",
    fieldValues: {
      produitId: 0,
      quantite: 0,
      prix: 0,
    },
    errors: undefined,
  });
  const [formState, formAction] = useFormState(Modifier, {
    ok: false,
    message: "",
    fieldValues: {
      id: data?.id,
      client: data?.client as string,
    },
    errors: undefined,
  });
  const [produit, setProduit] = useState({
    id: 0,
    designation: "",
    prix: 0,
    quantite: 0,
    categorieId: 0,
  });
  const [prix, setPrix] = useState(0);
  const columns = [
    {
      field: "produit",
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
  const formLignesRef = useRef<HTMLFormElement>(null);
  const prixRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [quantite, setQuantite] = useState(0);
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
    if (formStateLigne.ok) {
      formLignesRef.current?.reset();
      setQuantite(0);
      setProduit({
        id: 0,
        designation: "",
        prix: 0,
        quantite: 0,
        categorieId: 0,
      });
      setPrix(0);
      setSnackBarInfo({
        ok: formStateLigne.ok,
        msg: formStateLigne.message,
      });
      setOpenProductDialog(false);
    } else {
      setSnackBarInfo({
        ok: formStateLigne.ok,
        msg: formStateLigne.message,
      });
    }
  }, [formState, formStateLigne]);
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
              <Stack>
                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<AddCircle />}
                    onClick={() => setOpenProductDialog(true)}
                  >
                    Ajouter au panier
                  </Button>
                  <Button
                    startIcon={<PrintIcon />}
                    component={Link}
                    href={`/commandes/${data?.id}/voir`}
                    variant="contained"
                    color="success"
                  >
                    Facturer
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </Paper>
      <Data
        columns={columns}
        formAction={SupprimerLigne}
        rows={data?.ligneCommande.map((ligne) => ({
          ...ligne,
          produit: ligne.produit.designation,
        }))}
        route="commandes"
        update={false}
        subTag="la vente du produit "
        tag="produit"
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
            {title.substring(0, title.length - 1).toLowerCase()} du client :{" "}
            {data?.client} ?
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
            <form ref={formLignesRef} action={formActionLigne}>
              <Stack spacing={2}>
                <Typography variant="h6" color={"text.secondary"} gutterBottom>
                  Detail
                </Typography>
                <input
                  type="number"
                  name="id"
                  defaultValue={formState.fieldValues.id}
                  hidden
                />
                <FormControl fullWidth>
                  <InputLabel id="categorie">Produit</InputLabel>
                  <Select
                    labelId="produit"
                    id="produit"
                    label="produit"
                    required
                    name="produitId"
                    error={Boolean(formStateLigne.errors?.produitId)}
                    onChange={(e) => {
                      setProduit(
                        produits?.find(
                          (produit) => produit.id.toString() == e.target.value
                        ) ?? {
                          id: 0,
                          designation: "",
                          prix: 0,
                          quantite: 0,
                          categorieId: 0,
                        }
                      );
                      setPrix(
                        produits?.find(
                          (produit) => produit.id.toString() == e.target.value
                        )?.prix ?? 0
                      );
                    }}
                  >
                    {produits &&
                      produits.map((produit) => (
                        <MenuItem
                          key={produit.id}
                          value={produit.id.toString()}
                        >
                          {produit.designation}
                        </MenuItem>
                      ))}
                  </Select>
                  <FormHelperText>
                    {formStateLigne.errors?.produitId ??
                      "Sélectionnez une catégorie"}
                  </FormHelperText>
                </FormControl>
                <Stack spacing={2} direction={"row"}>
                  <FormControl fullWidth>
                    <TextField
                      ref={prixRef}
                      label="Prix"
                      name="prix"
                      type="number"
                      required
                      value={prix}
                      onChange={(e) =>
                        parseFloat(e.target.value) >= produit.prix &&
                        setPrix(parseFloat(e.target.value))
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">$</InputAdornment>
                        ),
                        inputProps: {
                          step: 0.1,
                        },
                      }}
                      fullWidth
                      error={Boolean(formStateLigne.errors?.prix)}
                      helperText={
                        Boolean(formStateLigne.errors?.prix)
                          ? formStateLigne.errors?.prix
                          : "Inserer un prix"
                      }
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      label="Stock"
                      required
                      value={produit?.quantite}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      error={Boolean(formStateLigne.errors?.prix)}
                      helperText={
                        Boolean(formStateLigne.errors?.prix)
                          ? formStateLigne.errors?.prix
                          : "Inserer un prix"
                      }
                    />
                  </FormControl>
                </Stack>
                <FormControl fullWidth>
                  <TextField
                    label="Quantite"
                    name="quantite"
                    type="number"
                    required
                    defaultValue={formStateLigne.fieldValues.quantite}
                    value={quantite}
                    // InputProps={{ readOnly: true }}
                    onChange={(e) =>
                      parseInt(e.target.value) > 0 &&
                      parseInt(e.target.value) < produit.quantite &&
                      setQuantite(parseInt(e.target.value))
                    }
                    fullWidth
                    error={Boolean(formStateLigne.errors?.quantite)}
                    helperText={
                      Boolean(formStateLigne.errors?.quantite)
                        ? formStateLigne.errors?.quantite
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

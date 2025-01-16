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
import { Modifier, Supprimer } from "../actions";
import Data from "@/ui/data";
import { Ajouter, SupprimerClasseD } from "../../classes-disponibles/actions";
const title = "Options";
export default function EditForm({
  data,
  classes,
  options,
  classesD,
}: {
  data: {
    id: number;
    designation: string;
    Appartenir: {
      id: number;
      classe: {
        id: number;
        designation: string;
      };
    }[];
  } | null;

  classes:
    | {
        id: number;
        designation: string;
      }[]
    | null;
  options:
    | {
        id: number;
        designation: string;
      }[]
    | null;
  classesD:
    | {
        id: number;
        classeId: number;
        optionId: number;
      }[]
    | null;
}) {
  const { pending } = useFormStatus();
  const [formState, formAction] = useFormState(Modifier, {
    ok: false,
    message: "",
    fieldValues: {
      designation: data?.designation as string,
    },
    errors: undefined,
  });
  const [formStateClasse, formActionClasse] = useFormState(Ajouter, {
    ok: false,
    message: "",
    fieldValues: {
      optionId: 0,
      classeId: 0,
    },
    errors: undefined,
  });
  const theme = useTheme();
  const formRef = useRef<HTMLFormElement>(null);
  const formClassRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [openClassDialog, setOpenClassDialog] = useState(false);
  const [snackBarInfo, setSnackBarInfo] = useState({ ok: false, msg: "" });
  const [classesNonD, setClasseNonD] = useState(classes);
  const columns = [
    {
      field: "designation",
      headerName: "Classe",
      flex: 1,
    },
  ];
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
      setSnackBarInfo({ ok: formState.ok, msg: formState.message });
    } else {
      setSnackBarInfo({ ok: formState.ok, msg: formState.message });
    }
    if (formStateClasse.ok) {
      setSnackBarInfo({ ok: formStateClasse.ok, msg: formStateClasse.message });
      formClassRef.current?.reset();
      setOpenClassDialog(false);
    } else {
      setSnackBarInfo({ ok: formStateClasse.ok, msg: formStateClasse.message });
    }
  }, [formState, formStateClasse]);
  useEffect(() => {
    const resteClasses = classes?.filter(
      (classe) =>
        !classesD?.some(
          (classeD) =>
            classeD.classeId === classe.id && classeD.optionId === data?.id
        )
    );
    setClasseNonD(resteClasses ?? []);
  }, [classesD, classes, data]);
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
                Information sur l&apos;option
              </Typography>
              <input type="number" name="id" hidden defaultValue={data?.id} />
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
              <Stack spacing={2} direction={"row"}>
                <Stack spacing={2} width={"100%"}>
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
                  onClick={() => {
                    setOpenClassDialog(true);
                  }}
                >
                  Ajouter une classe disponible
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </Paper>
      <Paper
        sx={{
          padding: "1.5rem",
          borderRadius: "0.5rem",
          background: "#ffffff6e",
        }}
        elevation={1}
      >
        <Typography variant="button" gutterBottom>
          Les classes dispobibles
        </Typography>
        <Data
          columns={columns}
          rows={data?.Appartenir.map((appartenir) => ({
            id: appartenir.id,
            designation: appartenir.classe.designation,
          }))}
          route={getCleanLink(title)}
          update={false}
          tag="designation"
          subTag="la "
          formAction={SupprimerClasseD}
        />
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
            Êtes-vous sûr de supprimer l&apos;
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
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        open={openClassDialog}
        onClose={() => {
          setOpenClassDialog(false);
        }}
      >
        <DialogTitle id="classe-disponible">
          Ajouter une classe disponible pour l&apos;option &quot;
          {data?.designation}&quot;
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="add-description">
            <form ref={formClassRef} action={formActionClasse}>
              <Stack spacing={2}>
                <Typography variant="h6" color={"text.secondary"} gutterBottom>
                  Information sur la classe
                </Typography>

                <input name="optionId" defaultValue={data?.id} hidden />
                <FormControl fullWidth>
                  <InputLabel id="classeId">Classe</InputLabel>
                  <Select
                    name="classeId"
                    defaultValue={formStateClasse.fieldValues.classeId}
                    label="Classe"
                    labelId="classeId"
                    required
                  >
                    <MenuItem value={0} disabled>
                      Sélectionnez une classe
                    </MenuItem>
                    {classesNonD?.map((classe) => (
                      <MenuItem key={classe.id} value={classe.id}>
                        {classe.designation}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Sélectionnez une classe</FormHelperText>
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
                setOpenClassDialog(false);
              }}
            >
              Non (Annuler)
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

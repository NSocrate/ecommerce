"use client";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import MoreVert from "@mui/icons-material/MoreVert";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  Snackbar,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Link from "next/link";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { SnackAlert } from "./snackBar";
import { FaEye, FaLock, FaLockOpen } from "react-icons/fa6";

export default function Data({
  rows,
  columns,
  tag,
  subTag,
  formAction,
  route,
  action,
  deleteAction = true,
  update = true,
  voirBtn = false,
  actifBtn,
}: {
  rows: { id: number }[] | undefined;
  columns: { field: string; headerName: string; width?: number | 500 }[];
  tag?: string;
  subTag?: string;
  formAction?: (formData: FormData) => Promise<boolean>;
  route: string;
  action?: boolean;
  update?: boolean;
  deleteAction?: boolean;
  voirBtn?: boolean;
  actifBtn?: (id: number) => Promise<boolean>;
}) {
  const theme = useTheme();
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackBarInfo, setsnackBarInfo] = useState({ ok: false, msg: "" });
  const handleChose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setsnackBarInfo({ ok: false, msg: "" });
  };
  const columnsWithButton = [
    ...columns,
    {
      field: "id",
      headerName: "",
      renderCell: ({ row: { id } }: { row: { id: number } }) => (
        <IconButton
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            setAnchorEl(e.currentTarget)
          }
          aria-controls={open ? `data-grid` : undefined}
          aria-haspopup={open ? "true" : undefined}
          id={id.toString()}
        >
          <MoreVert />
        </IconButton>
      ),
    },
    // {
    //   field: "anneeScolaire",
    //   headerName: "",
    //   renderCell: ({
    //     row: { anneeScolaireId },
    //   }: {
    //     row: { anneeScolaireId: number };
    //   }) => (
    //     <IconButton>
    //       <FaEye />
    //     </IconButton>
    //   ),
    // },
  ];
  const [rowSelected, setRowSelected] = useState<any>({});
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        columns={action ? columns : columnsWithButton}
        rows={rows}
        pageSizeOptions={[5, 10, 25]}
        onRowClick={(row) => {
          setRowSelected(row.row);
          console.log(rowSelected);
        }}
      />
      <Menu
        id={`data-grid`}
        anchorEl={anchorEl}
        open={open}
        MenuListProps={{
          "aria-labelledby": "data-grid-button",
        }}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {voirBtn && (
          <MenuItem
            component={Link}
            href={`/${route}/${rowSelected?.eleveId}/${rowSelected.anneeScolaireId}`}
            onClick={handleClose}
          >
            <FaEye fontSize="small" />
            <Typography pl={1}>Voir</Typography>
          </MenuItem>
        )}
        {(update || deleteAction) && voirBtn && <Divider />}
        {update && (
          <MenuItem
            component={Link}
            href={`/${route}/${rowSelected?.id}`}
            onClick={handleClose}
          >
            <Edit fontSize="small" />
            <Typography pl={1}>Modifier</Typography>
          </MenuItem>
        )}
        {update && deleteAction && <Divider />}
        {deleteAction && (
          <MenuItem
            onClick={() => {
              setOpenDialog(true);
              setAnchorEl(null);
            }}
            sx={{ color: theme.palette.error.main }}
          >
            <Delete />
            <Typography pl={1}>Suprimer</Typography>
          </MenuItem>
        )}
        {deleteAction && actifBtn && <Divider />}
        {actifBtn && (
          <MenuItem
            onClick={async () => {
              if (await actifBtn(rowSelected?.id)) {
                setsnackBarInfo({ ok: true, msg: "Changement effectué" });
              } else {
                setsnackBarInfo({ ok: false, msg: "Echec de changement" });
              }
              setAnchorEl(null);
            }}
            disabled={rowSelected?.actif == "Non" ? false : true}
            sx={{
              color:
                rowSelected?.actif == "Non"
                  ? theme.palette.success.main
                  : theme.palette.common.black,
            }}
          >
            {rowSelected?.actif == "Non" ? <FaLockOpen /> : <FaLock />}
            <Typography pl={1}>
              {" "}
              {rowSelected?.actif == "Non" ? "Activer" : "Desactiver"}{" "}
            </Typography>
          </MenuItem>
        )}
      </Menu>

      {formAction && (
        <Dialog
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
          }}
        >
          <DialogTitle id="dialog-title">Suppression</DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-description">
              Êtes-vous sûr de supprimer {subTag && subTag}{" "} 
              {rowSelected[tag ? tag : "id"]} ?
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
                  if (await formAction(e)) {
                    setsnackBarInfo({ ok: true, msg: "Suppression reussie" });
                  } else {
                    setsnackBarInfo({ ok: false, msg: "Echec Suppression" });
                  }
                  setOpenDialog(false);
                }}
                ref={formRef}
              >
                <input
                  type="text"
                  name="id"
                  defaultValue={rowSelected?.id}
                  hidden
                />
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
      )}

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
    </Box>
  );
}

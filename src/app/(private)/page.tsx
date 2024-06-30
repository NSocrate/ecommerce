import Static from "@/ui/static";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  getCommandesAujourdhui,
  getCommandesDeLaSemaine,
  getCommandesDuMois,
} from "./commandes/actions";
import { formatDate } from "date-fns/format";

export const metadata = {
  title: "Accueil",
  description: "La page d'accueil",
};
export default async function Home() {
  const todayCommande = await getCommandesAujourdhui();
  const today = todayCommande.reduce(
    (acc, commande) =>
      acc +
      commande.ligneCommande.reduce(
        (acc, ligne) => acc + ligne.prix * ligne.quantite,
        0
      ),
    0
  );
  const week = (await getCommandesDeLaSemaine()).reduce(
    (acc, commande) =>
      acc +
      commande.ligneCommande.reduce(
        (acc, ligne) => acc + ligne.prix * ligne.quantite,
        0
      ),
    0
  );
  const month = (await getCommandesDuMois()).reduce(
    (acc, commande) =>
      acc +
      commande.ligneCommande.reduce(
        (acc, ligne) => acc + ligne.prix * ligne.quantite,
        0
      ),
    0
  );
  return (
    <Grid container>
      <Static today={today} week={week} month={month} />
      <Grid item md={12} xs={12}>
        <Paper sx={{ padding: "1rem" }} elevation={1}>
          <Typography variant="h6" gutterBottom>
            Commandes recentes
          </Typography>
          <TableContainer sx={{ height: 300 }}>
            <Table aria-label="commandes" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Num</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todayCommande.map((commande) => (
                  <TableRow
                    key={commande.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>{commande?.id}</TableCell>
                    <TableCell>{commande?.client?.toUpperCase()}</TableCell>
                    <TableCell>
                      {commande?.ligneCommande.reduce(
                        (acc, ligne) => acc + ligne.prix * ligne.quantite,
                        0
                      )} UM
                    </TableCell>
                    <TableCell align="center">{formatDate(commande?.date,"dd/MM/yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

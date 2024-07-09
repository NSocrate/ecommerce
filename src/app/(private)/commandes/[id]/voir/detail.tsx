"use client";
import {
    Box,
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { formatDate } from "date-fns/format";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
export default function Detail({
  com,
}: {
  com: {
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
}) {
  const facture = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => facture.current,
  });
  useEffect(() => {
    handlePrint();
  }, [handlePrint]);
  return (
    <>
      <Grid ref={facture} container gap={2} justifyContent={"center"}>
        <Grid item textAlign={"center"} md={7} sm={7}>
          <Typography variant="h6" fontWeight={500}>
            Boutique
          </Typography>
          <Typography fontWeight={500}>Royaume des Archanges</Typography>
          <Typography>NIP: A2414809Z</Typography>
          <Typography gutterBottom>
            Av. de la poste - Galerie Joviana Feu Rouge
          </Typography>
          <Typography align="center" variant="h6" fontWeight={500}>
            Facture N° 2
          </Typography>
        </Grid>
        <Grid item md={7} sm={7}>
          <Stack justifyContent={"space-between"} flexDirection={"row"}>
            <Typography gutterBottom>
              Client :{" "}
              {com?.client
                ?.charAt(0)
                .toUpperCase()
                .concat(com?.client.substring(1, com?.client.length))}
            </Typography>
            <Typography>
              Date : {formatDate(new Date(com?.date as Date), "dd/MM/yyyy")}
            </Typography>
          </Stack>
          <TableContainer sx={{ width: "100%" }}>
            <Table aria-label="commandes" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Produit</TableCell>
                  <TableCell>PU</TableCell>
                  <TableCell>Qte</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {com?.ligneCommande.map((ligne) => (
                  <TableRow
                    key={ligne.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>{ligne?.produit.designation}</TableCell>
                    <TableCell>{ligne?.prix}$</TableCell>
                    <TableCell>{ligne?.quantite}</TableCell>
                  </TableRow>
                ))}
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    {com?.ligneCommande.reduce(
                      (acc, ligne) => acc + ligne.quantite * ligne.prix,
                      0
                    )} $
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid
          item
          md={7}
          sm={7}
          fontStyle={"italic"}
          color={"text.secondary"}
          wrap="wrap"
        >
          <Typography>Nos contacts</Typography>
          <Stack justifyContent={"space-between"} direction={"row"}>
            <Typography>nabintunoella888@gmail.com</Typography>
            <Typography>+243 990 888 352</Typography>
          </Stack>
        </Grid>
      </Grid>
      <Box textAlign={"center"}>
        <Button variant="contained" color="info" onClick={handlePrint}>
          Imprimer
        </Button>
      </Box>
    </>
  );
}

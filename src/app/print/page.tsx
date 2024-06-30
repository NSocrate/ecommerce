"use client";
import {
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
import { getCommande } from "../(private)/commandes/actions";
import { formatDate } from "date-fns/format";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function Print() {
  const facture = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => facture.current,
  });
  // const com = await getCommande(2);
  // console.log(com?.ligneCommande);
  const com = {
    id: 2,
    date: "2024-06-30T14:12:20.613Z",
    client: "mikson",
    ligneCommande: [
      {
        id: 8,
        prix: 150,
        produitId: 2,
        quantite: 3,
        commandeId: 2,
        produit: {
          id: 2,
          designation: "Grands hollandais",
          quantite: 263,
          prix: 150,
          categorieId: 20,
        },
      },
      {
        id: 9,
        prix: 200,
        produitId: 3,
        quantite: 3,
        commandeId: 2,
        produit: {
          id: 3,
          designation: "Grands super",
          quantite: 117,
          prix: 200,
          categorieId: 20,
        },
      },
    ],
  };
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
              Date : {formatDate(com?.date as Date, "dd/MM/yyyy")}
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
                    <TableCell>{ligne?.prix}</TableCell>
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
                    )}
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
    </>
  );
}

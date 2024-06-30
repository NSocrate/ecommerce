import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import MuiLink from "@mui/material/Link";
import { getProduits, SupprimerProduit } from "./actions";
import Data from "@/ui/data";
import { getCleanLink } from "../../lib/functions";
const title = "Produits";
export const metadata = {
  title: title,
  description: `Liste des ${title.toLowerCase()}`,
};
export default async function Index() {
  const data = (await getProduits()).map((produit) => ({
    ...produit,
    categorieId: produit.categorie.designation,
  }));
  const columns = [
    {
      field: "designation",
      headerName: "Produit",
      flex: 1,
    },
    {
      field: "prix",
      headerName: "Prix",
      flex: 1,
    },
    {
      field: "quantite",
      headerName: "Quantité",
      flex: 1,
    },
    {
      field: "categorieId",
      headerName: "Catégorie",
      flex: 1,
    },
  ];
  return (
    <Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={400}
            color={"text-primary"}
            gutterBottom
          >
            {title}
          </Typography>
          <Breadcrumbs
            aria-label="Breadcrumbs"
            separator={
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  backgroundColor: "rgb(145, 158, 171)",
                  borderRadius: "50%",
                }}
              />
            }
            maxItems={3}
            sx={{
              paddingBottom: "1rem",
            }}
          >
            <MuiLink underline="hover" href="/" component={Link}>
              Accueil
            </MuiLink>
            <MuiLink
              underline="hover"
              href={`/${getCleanLink(title)}`}
              component={Link}
            >
              {title}
            </MuiLink>
            <Typography color={"text-primary"}>Liste</Typography>
          </Breadcrumbs>
        </Box>
        <Box>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            component={Link}
            href={`/${getCleanLink(title)}/ajouter`}
          >
            Ajouter
          </Button>
        </Box>
      </Stack>
      <Data
        columns={columns}
        formAction={SupprimerProduit}
        rows={data}
        route={getCleanLink(title)}
        tag="designation"
      />
    </Stack>
  );
}

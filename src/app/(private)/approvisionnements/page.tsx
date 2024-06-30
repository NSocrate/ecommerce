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
import { getApprovs, SupprimerApprov } from "./actions";
import Data from "@/ui/data";
import { getCleanLink } from "../../lib/functions";
import { formatDate } from "date-fns/format";
const title = "Approvisionnements";
export const metadata = {
  title: title,
  description: `Liste des ${title.toLowerCase()}`,
};
export default async function Index() {
  const data = (await getApprovs()).map((approv) => ({
    ...approv,
    produitId: approv.produit.designation,
    date: formatDate(approv.date,"dd/MM/yyy"),
  }));
  const columns = [
    {
      field: "produitId",
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
      field: "date",
      headerName: "Date",
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
        formAction={SupprimerApprov}
        rows={data}
        subTag="l'approvisionnement du produit "
        route={getCleanLink(title)}
        tag="produitId"
      />
    </Stack>
  );
}

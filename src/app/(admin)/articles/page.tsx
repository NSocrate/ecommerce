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
import Data from "@/ui/data";
import { getArticles, Supprimer } from "./actions";
import { getCleanLink } from "../../lib/functions";
const title = "Articles";
export const metadata = {
  title: title,
  description: `Liste des ${title.toLowerCase()}`,
};
export default async function Index() {
  const data = await getArticles();
  const columns = [
    {
      field: "title",
      headerName: "Article",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Prix",
      flex: 1,
    },
    {
      field: "category",
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
            fontWeight={500}
            color={"text-primary"}
            gutterBottom
          >
            {title.toUpperCase()}
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
        formAction={Supprimer}
        rows={data}
        route={getCleanLink(title)}
        subTag="l'option"
        tag="designation"
      />
    </Stack>
  );
}

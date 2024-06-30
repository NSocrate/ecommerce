import { Box, Breadcrumbs, Grid, Stack, Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import { getCleanLink } from "../../../lib/functions";
import EditForm from "./form";
import { Metadata } from "next";
import { getApprov } from "../actions";
import { getProduits } from "../../produits/actions";
const title = "Approvisionnements";
export const generateMetadata = async ({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> => {
  const data = await getApprov(params.id);
  return {
    title: `${title} - ${data?.produit.designation}`,
    description: `Formulaire de mofification de ${title}`,
  };
};
export default async function Index({ params }: { params: { id: number } }) {
  const data = await getApprov(params.id);
  const produits = await getProduits();
  return (
    <Stack>
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
          aria-label="breadcrumb"
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
        >
          <MuiLink underline="hover" color="inherit" href="/" component={Link}>
            Accueil
          </MuiLink>
          <MuiLink
            underline="hover"
            color="inherit"
            href={`/${getCleanLink(title)}`}
            component={Link}
          >
            {title}
          </MuiLink>
          <Typography color="text.primary">{params.id}</Typography>
        </Breadcrumbs>
      </Box>
      <Grid
        container
        marginTop={2}
        sx={{
          justifyContent: "center",
          minWidth: 400,
          minHeight: 550,
        }}
      >
        <Grid
          item
          md={10}
          xs={10}
          justifySelf={"center"}
          sx={{ minWidth: "24rem" }}
        >
          <EditForm data={data} produits={produits} />
        </Grid>
      </Grid>
    </Stack>
  );
}

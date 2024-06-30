import { Box, Breadcrumbs, Grid, Stack, Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import { getCleanLink } from "../../../lib/functions";
import EditForm from "./form";
import { Metadata } from "next";
import { getCategorie } from "../actions";
const title = "Catégories";
type Props = { params: { id: number } };
export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const data = await getCategorie(params.id);
  return {
    title: `${title} - ${data?.designation}`,
    description: `Formulaire de mofification de ${title}`,
  };
};
export default async function Index({ params }: Props) {
  const data = await getCategorie(params.id);
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
            Catégories
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
          <EditForm data={data} />
        </Grid>
      </Grid>
    </Stack>
  );
}

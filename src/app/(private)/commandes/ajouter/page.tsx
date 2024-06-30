import { Box, Breadcrumbs, Grid, Stack, Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import { getCleanLink } from "../../../lib/functions";
import AddForm from "./form";
const title = "Commandes";
export const metadata = {
  title: title,
  description: "Formulaire d'ajout des commandes",
};
export default function Index() {
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
          <Typography color="text.primary">Nouvelle</Typography>
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
          <AddForm />
        </Grid>
      </Grid>
    </Stack>
  );
}

import { Box, Breadcrumbs, Grid, Stack, Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import { getCleanLink } from "../../../../lib/functions";
import EditForm from "./form";
import { Metadata } from "next";
import { getClasse, getOptions } from "../actions";
import { getClasses } from "../../../(Admin)/classes/actions";
import { getClassesDisponibles } from "../../classes-disponibles/actions";
const title = "Options";
export const generateMetadata = async ({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> => {
  const data = await getClasse(params.id);
  return {
    title: `${title} - ${data?.designation}`,
    description: `Formulaire de modification de ${title}`,
  };
};
export default async function Index({ params }: { params: { id: number } }) {
  const data = await getClasse(params.id);
  const options = await getOptions();
  const classes = await getClasses();
  const classesD = await getClassesDisponibles();
  return (
    <Stack>
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
          <EditForm data={data} classes={classes} options={options} classesD={classesD}  />
        </Grid>
      </Grid>
    </Stack>
  );
}

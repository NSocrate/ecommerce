import { Box, Grid, Typography } from "@mui/material";
import { getUsers } from "../actions";
import Form from "./form";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Connexion",
  description: `la page de connexion`,
};
export default async function Login() {
  const users = await getUsers();
  users.length < 1 && redirect("/creer-un-compte");
  return (
    <Grid container height={"100vh"} justifyContent={"center"}>
      <Grid
        item
        md={7}
        sx={{
          display: { xs: "none", md: "block" },
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          height: "100%",
          position: "relative",
          zIndex: 1,
          "&::before": {
            content: '""',
            background: `#01102e4d`,
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: -1,
          },
        }}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          flexDirection={"column"}
          color={"white"}
        >
          <Typography variant="h2" fontWeight={500}>
            Bienvenue
          </Typography>
          <Typography variant="subtitle1">
            Pour une gestion efficase et efficiente de votre stock
          </Typography>
        </Box>
      </Grid>
      <Grid item md={5} sm={6} minWidth={400} alignSelf={"center"}>
        <Typography align="center" variant="h4" fontWeight={600}>
          Connectez-vous
        </Typography>
        <Form/>
      </Grid>
    </Grid>
  );
}

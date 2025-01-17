import { Grid, Paper, Typography } from "@mui/material";
import Form from "./form";
export const metadata = {
  title: "Connexion",
  description: `la page de connexion`,
};
export default async function Login() {
  return (
    <Grid container height={"100vh"} justifyContent={"center"}>
     
      <Grid item md={5} sm={6} minWidth={400} alignSelf={"center"}>
      <Paper sx={{paddingY:5}}>
      <Typography align="center" variant="h4" fontWeight={600}>
          Connectez-vous
        </Typography>
        <Form />
      </Paper>
       
      </Grid>
    </Grid>
  );
}

"use client";
import { Grid, Paper, Typography, useTheme } from "@mui/material";

export default function Static({
  today,
  week,
  month,
}: {
  today: number;
  week: number;
  month: number;
}) {
  return (
    <>
      <Typography gutterBottom color={"text.secondary"} ml={2}>
        Statistique
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: "1rem", borderRadius: "1rem" }}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="subtitle1" pb={2}>
                  Aujourd&apos;hui
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h5" fontWeight={500}>
                  {today} $
                </Typography>
              </Grid>
              <Grid item xs={4} alignSelf={"center"}>
                {((today * 100) / (month || 1)).toFixed(2)} %
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: "1rem", borderRadius: "1rem" }}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="subtitle1" pb={2}>
                  Semaine
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h5" fontWeight={500}>
                  {week} $
                </Typography>
              </Grid>
              <Grid item xs={4} alignSelf={"center"}>
                {((week * 100) / (month || 1)).toFixed(2)} %
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: "1rem", borderRadius: "1rem" }} elevation={1}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="subtitle1" pb={2}>
                  Mois
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h5" fontWeight={500}>
                  {month} $
                </Typography>
              </Grid>
              <Grid item xs={4} alignSelf={"center"}>
                100 %
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

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
              <Grid item xs={9}>
                <Typography variant="h5" fontWeight={500}>
                  {today}
                </Typography>
                Unité monétaire
              </Grid>
              <Grid item xs={3} alignSelf={"center"}>
                {(today * 100) / (month || 1)} %
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: "1rem", borderRadius: "1rem" }}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="subtitle1" pb={2}>
                  Semaines
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="h5" fontWeight={500}>
                  {week}
                </Typography>
                Unité monétaire
              </Grid>
              <Grid item xs={3} alignSelf={"center"}>
                {(week * 100) / (month || 1)} %
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
              <Grid item xs={9}>
                <Typography variant="h5" fontWeight={500}>
                  {month}
                </Typography>
                Unité monétaire
              </Grid>
              <Grid item xs={3} alignSelf={"center"}>
                100 %
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

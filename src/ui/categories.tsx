import { Box, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

export default function CategoryProd({ data }: { data: Array<String> }) {
  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Catégories
      </Typography>
      <Grid container justifyContent={"center"} paddingBottom={4}>
        {data.map((categorie, index) => (
          <Grid item  key={index} md={2} sm={4} xs={6}>
            <Link
              href={"#"}
             
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Image
                alt="category img"
                src={"/category.png"}
                width={120}
                height={120}
              />
              <Typography color="primary" align="center">
                {categorie.toUpperCase()}
              </Typography>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}

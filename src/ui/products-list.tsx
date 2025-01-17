import { getCleanLink } from "@/app/lib/functions";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Skeleton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { Fragment, Suspense } from "react";

export default function ProdList({
  data,
}: {
  data: {
    id: number;
    title: string;
    price: number;
    description: string;
    category: number;
    image: string;
    rating: {
    rate: number,
  }
  }[];
}) {
  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Nos Produits
      </Typography>
      <Grid container spacing={2}>
        {data.map((article, index) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
            <Link
              href={getCleanLink(`/${article.title}_${article.id}`)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Suspense
                fallback={
                  <>
                    <Skeleton
                      sx={{ height: 190 }}
                      animation="wave"
                      variant="rectangular"
                    />
                    <Skeleton
                      animation="wave"
                      height={10}
                      style={{ marginBottom: 6 }}
                    />
                    <Skeleton animation="wave" height={10} width="80%" />
                  </>
                }
              >
                <Card sx={{ maxWidth: 345, minHeight: 400, maxHeight: 600 }}>
                  <CardMedia
                    sx={{ height: 180, backgroundSize: "contain" }}
                    image={article.image}
                    title={article.title}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      color={"primary"}
                    >
                      {article.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {article.description.slice(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between",flexWrap:'wrap' }}>
                    <Typography variant="h6">{article.price} $</Typography>
                    <Button size="small">Ajouter au panier</Button>
                    <Rating name="half-rating" defaultValue={article.rating.rate} precision={0.5} readOnly/>
                  </CardActions>
                </Card>
              </Suspense>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}

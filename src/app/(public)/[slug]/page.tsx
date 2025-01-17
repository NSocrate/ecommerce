"use server";
import { getArticle } from "@/app/(admin)/articles/actions";
import { getCleanLink } from "@/app/lib/functions";
import {
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ajouterAuPanier } from "../actions";;
import { Fragment } from "react";
import Link from "next/link";
import LinkMui from "@mui/material/Link";

export default async function Detail({ params }: { params: { slug: string } }) {
  const id = Number(params.slug.split("_")[1]);
  const article = await getArticle(id);
  return (
    <Fragment>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <LinkMui underline="hover" color="inherit" href="/" component={Link}>
          Acueil
        </LinkMui>
        <LinkMui
          underline="hover"
          color="inherit"
          href={getCleanLink(`${article.title}_${article.id}`)}
          component={Link}
        >
          {article.title}
        </LinkMui>
        <Typography sx={{ color: "text.primary" }}>Détail</Typography>
      </Breadcrumbs>
      <Card sx={{ display: { sm: "flex" } , justifyContent:"center"}}>
        <CardMedia
          sx={{ width: 500, maxWidth:700, height: 450, backgroundSize: "contain" }}
          image={article.image}
          title={article.title}
        />
        <Stack>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {article.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {article.description}
            </Typography>
          </CardContent>

          <CardActions sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              Prix : {article.price} $
            </Typography>
            <Rating
              name="half-rating"
              defaultValue={article.rating.rate}
              precision={0.5}
              readOnly
            />
          </CardActions>

          <form action={ajouterAuPanier} method="post">
          <input type="number" name="article" value={id} hidden />
            <Stack direction={"row"} spacing={2} padding={2}>
              <FormControl fullWidth>
                <TextField
                  label="Quantite"
                  type="number"
                  name="quantite"
                  fullWidth
                  required
                  defaultValue={1}
                  inputProps={{ min: 1 }}
                />
              </FormControl>
              <Button size="small" fullWidth variant="outlined" type="submit">
                Ajouter au panier
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Fragment>
  );
}

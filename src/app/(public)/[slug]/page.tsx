import { getArticle } from "@/app/(admin)/articles/actions";
import { getCleanLink } from "@/app/lib/functions";
import {
    Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Link,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

export default async function Detail({ params }: { params: { slug: string } }) {
  const id = Number(params.slug.split("_")[1]);
  const article = await getArticle(id);
  return (
    <Container sx={{ paddingY: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Acueil
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href={getCleanLink(`${article.title}_${article.id}`)}
        >
          {article.title}
        </Link>
        <Typography sx={{ color: "text.primary" }}>Détail</Typography>
      </Breadcrumbs>
      <Card sx={{ display:'block'}}>
        <CardMedia
          sx={{ width: "100%", height: 450, objectFit: "cover" }}
          image={article.image}
          title="green iguana"
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
          <Button variant="outlined">Ajouter au panier</Button>
        </Stack>
      </Card>
    </Container>
  );
}

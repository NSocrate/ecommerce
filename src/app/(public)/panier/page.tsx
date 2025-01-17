import {
  Avatar,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import LinkMui from "@mui/material/Link";
import Link from "next/link";
import { Fragment } from "react";
import { getPanier, passerCommande, retirerDuPanier } from "../actions";
import { getArticles } from "@/app/(admin)/articles/actions";
import { MdDeleteSweep } from "react-icons/md";

export default async function Panier() {
  const panier = await getPanier();
  const articles = await getArticles();
  const coutPanier = panier
    .reduce(
      (acc, val) =>
        acc +
        articles.find((article: { id: number }) => article.id == val.productId)
          .price,
      0
    )
    .toFixed(2);
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <LinkMui underline="hover" color="inherit" href="/" component={Link}>
          Acueil
        </LinkMui>
        <Typography sx={{ color: "text.primary" }}>Mon panier</Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item md={8} sm={12}>
          {panier.length > 0 ? (
            <List>
              {panier.map((ligne) => {
                const article = articles.find(
                  (articleItem: { id: number }) =>
                    articleItem.id == ligne.productId
                );
                return (
                  <Fragment key={ligne.productId}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt={article.title} src={article.image} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={article.title}
                        secondary={
                          <Stack
                            direction={"row"}
                            justifyContent={"space-around"}
                            paddingTop={1}
                            alignItems={"center"}
                          >
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: "text.primary", display: "inline" }}
                            >
                              Quantité : {ligne.quantity}
                            </Typography>

                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: "text.primary", display: "inline" }}
                            >
                              Prix : {article.price}
                            </Typography>

                            <form action={retirerDuPanier} method="post">
                              <input
                                type="number"
                                name="article"
                                value={ligne.productId}
                                hidden
                              />
                              <Button
                                size="small"
                                type="submit"
                                startIcon={<MdDeleteSweep />}
                              >
                                Retirer du panier
                              </Button>
                            </form>
                          </Stack>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </Fragment>
                );
              })}
            </List>
          ) : (
            <Typography color={"text.secondary"}>Le panier est vide</Typography>
          )}
        </Grid>
        <Grid item md={4} sm={12}>
          <Typography
            variant="h6"
            align="center"
            fontWeight={"500"}
            color={"primary"}
          >
            Finaliser la commande
          </Typography>

          <List>
            <ListItem>
              <Typography color="text.secondary">
                {" "}
                Nombre de produits : {panier.length}
              </Typography>
            </ListItem>
            <ListItem color="text.secondary">
              <Typography color="text.secondary">
                {" "}
                Total : {coutPanier} ${" "}
              </Typography>
            </ListItem>
          </List>
          <form action={passerCommande} method="post">
            <Button
              color="success"
              variant="contained"
              fullWidth
              type="submit"
              disabled={panier.length == 0}
            >
              Passer la commande
            </Button>
          </form>
        </Grid>
      </Grid>
    </>
  );
}

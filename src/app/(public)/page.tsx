import CategoryProd from "@/ui/categories";
import NavBar from "@/ui/navBar";
import { Box, Container, Stack } from "@mui/material";
import { getCategories } from "../lib/actions";
import ProdList from "@/ui/products-list";
import { getArticles } from "../(admin)/articles/actions";

export default async function Index() {
  const categoriesProd = await getCategories();
  const articles = await getArticles();
  return (
    <Container sx={{ marginY: 3 }}>
      <CategoryProd data={categoriesProd} />
      <ProdList data={articles} />
    </Container>
  );
}

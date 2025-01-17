import { Box, Container, Stack } from "@mui/material";
import { getAuth } from "@/app/(auth)/actions";
import NavBar from "@/ui/navBar";
import { getPanier } from "./actions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await getAuth();
  const panier = await getPanier();
  return (
    <Stack direction={"row"} minHeight={"100vh"}>
      <Box
        width={"100%"}
        sx={{
          overflow: "hidden",
        }}
      >
        <NavBar auth={auth} panier={panier} />
        <Container sx={{marginY:3}}>{children}</Container>
      </Box>
    </Stack>
  );
}

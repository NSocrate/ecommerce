
import { Box, Stack } from "@mui/material";
import { getAuth } from "@/app/(auth)/actions";
import NavBar from "@/ui/navBar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await getAuth();
  return (
    <Stack direction={"row"} minHeight={"100vh"}>
    <Box
      width={"100%"}
      sx={{
        overflow: "hidden",
      }}
    >
      <NavBar />
      {children}
    </Box>
  </Stack>
  );
}

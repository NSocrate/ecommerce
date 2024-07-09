
import { Box, Stack } from "@mui/material";
import Prosidebar from "@/ui/proSideBar";
import TopBar from "@/ui/topBar";
import Main from "@/ui/main";
import { getAuth } from "@/app/(auth)/actions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await getAuth();
  return (
    <Stack direction={"row"} height={"100vh"}>
      <Prosidebar />
      <Box
        width={"100%"}
        sx={{
          overflow:"hidden",
        }}
      >
        <TopBar user={auth} />
        <Main>{children}</Main>
      </Box>
    </Stack>
  );
}

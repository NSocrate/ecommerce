"use client";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  SvgIcon,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import Prosidebar from "./proSideBar";
import Image from "next/image";
import ThemeSwitch from "./ThemeSwitch";
import PersonIcon from "@mui/icons-material/Person";
import { LogOut } from "@/app/(auth)/actions";

export default function TopBar({
  user,
}: {
  user: { id: number; login: string; fonction: string };
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <AppBar
        position="static"
        sx={{
          boxShadow: "none",
          background: theme.palette.background.default,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "10px",
            height: "10px",
            background: theme.palette.background.default,
            top: "64px",
            left: "inherit",
            zIndex: 10,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: "20px",
            height: "20px",
            background: theme.palette.grey[50],
            borderRadius: "50%",
            top: "64px",
            left: "inherit",
            zIndex: 100,
          },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack>
            <IconButton
              sx={{
                display: {
                  sm: "none",
                },
              }}
              edge="start"
              aria-label="logo"
              onClick={() => setIsDrawerOpen(true)}
            >
              <SvgIcon>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.32"
                    d="M15.2798 4.5H4.7202C3.77169 4.5 3 5.06057 3 5.75042C3 6.43943 3.77169 7 4.7202 7H15.2798C16.2283 7 17 6.43943 17 5.75042C17 5.06054 16.2283 4.5 15.2798 4.5Z"
                    fill="#1877F2"
                  />
                  <path
                    d="M19.2798 10.75H8.7202C7.77169 10.75 7 11.3106 7 12.0004C7 12.6894 7.77169 13.25 8.7202 13.25H19.2798C20.2283 13.25 21 12.6894 21 12.0004C21 11.3105 20.2283 10.75 19.2798 10.75Z"
                    fill="#1877F2"
                  />
                  <path
                    d="M15.2798 17H4.7202C3.77169 17 3 17.5606 3 18.2504C3 18.9394 3.77169 19.5 4.7202 19.5H15.2798C16.2283 19.5 17 18.9394 17 18.2504C17 17.5606 16.2283 17 15.2798 17Z"
                    fill="#1877F2"
                  />
                </svg>
              </SvgIcon>
            </IconButton>
            <Drawer
              anchor="left"
              open={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
            >
              <Prosidebar isDrawer={true} auth={user} />
            </Drawer>
          </Stack>
          <Stack
            sx={{
              display: {
                sm: "none",
              },
            }}
          >
            <Image src={"/icon.png"} alt="logo" width={50} height={50} />
          </Stack>
          <Stack direction={"row"}>
            <ThemeSwitch />
            <IconButton
              id="profil-button"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              aria-controls={open ? "profil" : undefined}
              aria-haspopup={open ? "true" : undefined}
            >
              <Avatar>
                <Typography variant="h4" fontWeight={"900"}>
                  {user?.login?.charAt(0).toUpperCase()}
                </Typography>
              </Avatar>
            </IconButton>
            <Menu
              id="profil"
              anchorEl={anchorEl}
              open={open}
              MenuListProps={{
                "aria-labelledby": "profil-button",
              }}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem>
                <Stack direction={"row"} spacing={1}>
                  <PersonIcon sx={{ width: 25, height: 25 }} />
                  <Box>
                    <Typography>
                      {user?.login
                        ?.charAt(0)
                        .toUpperCase()
                        .concat(user?.login.substring(1, user?.login.length))}
                    </Typography>
                  </Box>
                </Stack>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose} sx={{ padding: 0 }}>
                <form action={LogOut}>
                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      "&:hover": {
                        background: "transparent",
                      },
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                      textTransform: "capitalize",
                    }}
                  >
                    Déconnexion
                  </Button>
                </form>
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}

"use client";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Image from "next/image";
import Link from "next/link";
import Category from "@mui/icons-material/Category";
import LocalParking from "@mui/icons-material/LocalParking";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { usePathname } from "next/navigation";
import ShoppingBag from "@mui/icons-material/ShoppingBag";

const Prosidebar = ({ isDrawer = false }) => {
  const [collapseSidebar, setCollapseSidebar] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  useEffect(() => {
    window.addEventListener("resize", () => {
      window.innerWidth <= 768 && isDrawer
        ? setCollapseSidebar(true)
        : setCollapseSidebar(false);
    });
  });
  return (
    <Sidebar
      backgroundColor={theme.palette.background.default}
      breakPoint={!isDrawer ? "sm" : undefined}
      transitionDuration={500}
      collapsed={collapseSidebar}
      onMouseEnter={() =>
        window.innerWidth <= 768 && !isDrawer && setCollapseSidebar(false)
      }
      onMouseLeave={() =>
        window.innerWidth <= 768 && !isDrawer && setCollapseSidebar(true)
      }
      style={{ height: "100vh", borderRight: "none" }}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={0.5}
        p={1}
        pb={3}
      >
        <Image src={"/OS.png"} width={50} height={50} alt="logo" />
        {!collapseSidebar && (
          <Typography
            variant="h6"
            color={theme.palette.primary.main}
            fontWeight={500}
          >
            GESTOCK
          </Typography>
        )}
      </Box>
      <Menu
        menuItemStyles={{
          button: {
            [`&.active`]: {
              backgroundColor: theme.palette.primary.light,
              fontWeight: 500,
              color: theme.palette.common.white,
            },
            [`&:hover`]: {
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.common.white,
            },
            [`&:hover svg`]: {
              color: theme.palette.common.white,
            },
            [`&.active svg`]: {
              color: theme.palette.common.white,
            },
            ["&"]: {
              borderTopLeftRadius: "2rem",
              borderEndEndRadius: "2rem",
            },
            marginBottom:1
          },

          icon: {
            color: theme.palette.primary.main,
          },
        }}
      >
        {!collapseSidebar && (
          <MenuItem disabled>
            <p color={theme.palette.primary.main}>Général</p>
          </MenuItem>
        )}
        <MenuItem
          icon={<HomeIcon />}
          component={
            <Link
              href={"/"}
              className={pathname.endsWith("/") ? "active" : undefined}
            />
          }
        >
          Accueil
        </MenuItem>
        <MenuItem
          component={
            <Link
              href={"/categories"}
              className={
                pathname.startsWith("/categories") ? "active" : undefined
              }
            />
          }
          icon={<Category />}
        >
          Catégories
        </MenuItem>
        <MenuItem
          component={
            <Link
              href={"/produits"}
              className={
                pathname.startsWith("/produits") ? "active" : undefined
              }
            />
          }
          icon={<LocalParking />}
        >
          Produits
        </MenuItem>
        <MenuItem
          component={
            <Link
              href={"/approvisionnements"}
              className={
                pathname.startsWith("/approvisionnements") ? "active" : undefined
              }
            />
          }
          icon={<AddBusinessIcon />}
        >
          Approvisionnements
        </MenuItem>
        <MenuItem
          component={
            <Link
              href={"/commandes"}
              className={
                pathname.startsWith("/commandes") ? "active" : undefined
              }
            />
          }
          icon={<ShoppingBag />}
        >
          Commandes
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default Prosidebar;

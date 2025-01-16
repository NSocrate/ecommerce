"use client";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { TiHome } from "react-icons/ti";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { FaPeopleRoof } from "react-icons/fa6";
import {
  TbCircleLetterCFilled,
  TbCircleLetterDFilled,
  TbHexagonLetterAFilled,
  TbHexagonLetterCFilled,
  TbHexagonLetterDFilled,
  TbHexagonLetterEFilled,
  TbHexagonLetterOFilled,
  TbHexagonLetterSFilled,
  TbHexagonLetterTFilled,
  TbHexagonLetterPFilled,
  TbListNumbers,
  TbCircleLetterTFilled,
  TbCircleLetterPFilled,
  TbCircleLetterEFilled,
  TbHexagonLetterC,
  TbHexagonLetterRFilled,
} from "react-icons/tb";
import { FaUsersCog } from "react-icons/fa";
const Prosidebar = ({
  auth,
  isDrawer = false,
}: {
  auth: {
    id: number;
    login: string;
    fonction: string;
  };
  isDrawer?: boolean;
}) => {
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
      width="270px"
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
        <Image src={"/icon.png"} width={50} height={50} alt="logo" />
        {!collapseSidebar && (
          <Typography variant="h6" fontWeight={500}>
            EDAP/ISP
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
              borderTopLeftRadius: "1.7rem",
              borderEndEndRadius: "1.7rem",
              height: "45px",
            },
            marginBottom: 1,
          },
          icon: {
            color: theme.palette.primary.main,
            fontSize: "1.5rem",
          },
          subMenuContent: {
            background: theme.palette.common.white,
          },
        }}
      >
        {!collapseSidebar && (
          <MenuItem disabled>
            <p color={theme.palette.primary.main}>Général</p>
          </MenuItem>
        )}
        <MenuItem
          component={
            <Link
              href={"/articles"}
              className={pathname === "/" ? "active" : undefined}
            />
          }
          icon={<TiHome />}
        >
          Articles
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default Prosidebar;

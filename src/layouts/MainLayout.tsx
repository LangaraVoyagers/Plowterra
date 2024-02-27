import { Box, CssBaseline, Divider, IconButton, List } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { CSSObject, Theme, styled } from "@mui/material/styles";
import { useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { Outlet } from "react-router-dom";

import {
  ArchiveTray,
  CaretRight,
  EnvelopeSimple,
  NotePencil,
  CaretLeft,
  House,
  CurrencyCircleDollar,
  Notepad,
  User,
  } from "@phosphor-icons/react";

import paths from "shared/paths";

const DRAWER_WIDTH = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const sidebarItems = [
  {
    title: "Home",
    icon: <House />,
    href: "",
  },
  {
    title: "Daily Harvest",
    icon: <NotePencil />,
    href: "",
  },
  {
    title: "Pickers",
    icon: <User />,
    href: paths.pickers,
  },
  {
    title: "Payroll",
    icon: <CurrencyCircleDollar />,
    href: "",
  },
  {
    title: "Harvest Seasons",
    icon: <Notepad />,
    href: "",
  },
];

const quickActions = ["Add Daily Harvest", "Add Picker"];

export default function MainLayout() {
  const [open, setOpen] = useState(true);

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  return (
    <Box height="100%" display="flex">
      <CssBaseline />
      {/* Sidebar */}
      <Drawer component="aside" variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {!open ? <CaretRight /> : <CaretLeft />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {sidebarItems.map(({ title, icon, href }) => (
            <ListItem key={title} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                href={href}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>

                <ListItemText primary={title} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <ListItem sx={{ opacity: open ? 1 : 0 }}>Quick Actions</ListItem>
        <List>
          {quickActions.map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {index % 2 === 0 ? <ArchiveTray /> : <EnvelopeSimple />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Content */}
      <Box component="main" height="100%" flexGrow={1} p={3}>
        <Outlet />
      </Box>
    </Box>
  );
}

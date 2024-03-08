import {
  CaretLeft,
  CaretRight,
  FilePlus,
  FileText,
  HandCoins,
  House,
  Plant,
  UserPlus,
  Users,
} from "@phosphor-icons/react";
import {
  Box,
  CssBaseline,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { CSSObject, Theme, styled } from "@mui/material/styles";
import { LANGUAGES, useLocale } from "context/LocaleProvider";

import { FormattedMessage } from "react-intl";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiDrawer from "@mui/material/Drawer";
import { Outlet } from "react-router-dom";
import paths from "shared/paths";
import { useState } from "react";
import { useUser } from "context/UserProvider";

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
    title: <FormattedMessage id="sidebar.home" defaultMessage="Home" />,
    icon: <House />,
    href: "",
  },
  {
    title: (
      <FormattedMessage id="sidebar.harvest_log" defaultMessage="Harvest Log" />
    ),
    icon: <FileText />,
    href: paths.harvestLogs,
  },
  {
    title: <FormattedMessage id="sidebar.pickers" defaultMessage="Pickers" />,
    icon: <Users />,
    href: paths.pickers,
  },
  {
    title: <FormattedMessage id="sidebar.payroll" defaultMessage="Payroll" />,
    icon: <HandCoins />,
    href: paths.payroll,
  },
  {
    title: (
      <FormattedMessage
        id="sidebar.harvest_season"
        defaultMessage="Harvest Season"
      />
    ),
    icon: <Plant />,
    href: paths.seasons,
  },
];

const quickActions = [
  {
    title: (
      <FormattedMessage
        id="sidebar.quick_actions.add_picker"
        defaultMessage="Add Picker"
      />
    ),
    icon: <UserPlus />,
    href: `${paths.pickers}?new=true`,
  },
  {
    title: (
      <FormattedMessage
        id="sidebar.quick_actions.add_harvest_log"
        defaultMessage="Add Harvest Entry"
      />
    ),
    icon: <FilePlus />,
    href: "#",
  },
];

export default function MainLayout() {
  const [open, setOpen] = useState(true);
  const { user } = useUser();

  const { locale, selectLanguage } = useLocale();

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  return (
    <Box height="100%" display="flex">
      <CssBaseline />
      {/* Sidebar */}
      <Drawer component="aside" variant="permanent" open={open}>
        <Box display="flex" flex={1} flexDirection="column">
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {!open ? <CaretRight /> : <CaretLeft />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {sidebarItems.map(({ title, icon, href }, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
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

                  <ListItemText
                    primary={title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <ListItem sx={{ opacity: open ? 1 : 0 }}>
            <FormattedMessage
              id="sidebar.quick_actions"
              defaultMessage="Quick Actions"
            />
          </ListItem>
          <List>
            {quickActions.map((data, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  href={data.href}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {data.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={data.title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <Typography>{user.name}</Typography>
          <FormControl fullWidth>
            <InputLabel id="language-label">Language</InputLabel>

            <Select
              labelId="language-label"
              id="language-select"
              value={locale}
              size="small"
              onChange={async (event) => {
                await selectLanguage(
                  event.target.value as keyof typeof LANGUAGES
                );
              }}
              label="Language"
            >
              <MenuItem value={LANGUAGES.en}>English</MenuItem>
              <MenuItem value={LANGUAGES.es}>Spanish</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Drawer>
      {/* Content */}
      <Box component="main" height="100%" flexGrow={1} p={3}>
        <Outlet />
      </Box>
    </Box>
  );
}

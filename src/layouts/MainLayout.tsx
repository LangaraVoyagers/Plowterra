import {
  FilePlus,
  FileText,
  HandCoins,
  House,
  Plant,
  UserPlus,
  Users,
  List as ListIcon,
} from "@phosphor-icons/react"
import { Box, IconButton, List, useMediaQuery } from "@mui/material";
import { CSSObject, Theme, styled, useTheme } from "@mui/material/styles";

import { FormattedMessage } from "react-intl";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiDrawer from "@mui/material/Drawer";
import { Outlet } from "react-router-dom";
import paths from "shared/paths";
import { useState } from "react";
import { BodyText, Label } from "ui/Typography";
import SidebarIcon from "../assets/icons/SidebarIcon.svg";
import Logo from "../assets/images/Logo.svg";
import LogoSquare from "../assets/images/LogoSquare.svg";
import UserMenu from "components/UserMenu";
import { usePersistedState } from "hooks/usePersistedState";

const DRAWER_WIDTH = 288;

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: "500ms",
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: "500ms",
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(11)} + 1px)`,
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

const iconSettings = {
  size: "1.5rem",
};

const sidebarItems = [
  {
    title: <FormattedMessage id="sidebar.home" defaultMessage="Home" />,
    icon: <House {...iconSettings} />,
    href: paths.home,
  },
  {
    title: (
      <FormattedMessage id="sidebar.harvest_log" defaultMessage="Harvest Log" />
    ),
    icon: <FileText {...iconSettings} />,
    href: paths.harvestLogs,
  },
  {
    title: <FormattedMessage id="sidebar.pickers" defaultMessage="Pickers" />,
    icon: <Users {...iconSettings} />,
    href: paths.pickers,
  },
  {
    title: <FormattedMessage id="sidebar.payroll" defaultMessage="Payroll" />,
    icon: <HandCoins {...iconSettings} />,
    href: paths.payroll,
  },
  {
    title: (
      <FormattedMessage
        id="sidebar.harvest_season"
        defaultMessage="Harvest Season"
      />
    ),
    icon: <Plant {...iconSettings} />,
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
    icon: <UserPlus {...iconSettings} />,
    href: `${paths.pickers}?new=true`,
  },
  {
    title: (
      <FormattedMessage
        id="sidebar.quick_actions.add_harvest_log"
        defaultMessage="Add Harvest Entry"
      />
    ),
    icon: <FilePlus {...iconSettings} />,
    href: `${paths.harvestLogs}?new=true`,
  },
];
const container = window !== undefined ? () => window.document.body : undefined;

export default function MainLayout() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const [expanded, setOpen] = usePersistedState("sidebar-expanded", true);
  const open = mobile || expanded;

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerClose = () => {
    if (mobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const openDrawer = () => {
    if (!mobile) {
      setOpen(true);
    }
  };

  const drawer = (
    <>
      <Box display="flex" flex={1} flexDirection="column">
        <DrawerHeader>
          <Box
            height="4.25rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              transform: "translateX(13.5px)",
              transition: "all 300ms",
            }}
            paddingRight={2}
            paddingLeft={1}
            width="100%"
          >
            {!!open || !!mobileOpen ? (
              <img src={Logo} alt="Plowterra logo" height={30} aria-hidden />
            ) : (
              <img
                src={LogoSquare}
                alt="Plowterra logo"
                height={30}
                onClick={handleDrawerClose}
                aria-hidden
              />
            )}
            {(!!open || !!mobileOpen) && (
              <IconButton
                onClick={handleDrawerClose}
                aria-label="Close sidebar"
              >
                <img
                  src={SidebarIcon}
                  alt="sidebaricon"
                  width={18}
                  height={18}
                  aria-hidden
                />
              </IconButton>
            )}
          </Box>
        </DrawerHeader>
        <Box paddingLeft="1.5rem" sx={{ opacity: open ? 1 : 0 }}>
          <Label color="grey-500" size="xs" fontWeight="SemiBold">
            <FormattedMessage
              id="sidebar.main.sections"
              defaultMessage="Main Sections"
            />
          </Label>
        </Box>
        <List>
          {sidebarItems.map(({ title, icon, href }, index) => (
            <SidebarMenuItem
              key={index}
              open={open}
              title={title}
              icon={icon}
              href={href}
            />
          ))}
        </List>
        {/* <Divider /> */}

        <Box paddingLeft="1.5rem" mt="3.25rem" sx={{ opacity: open ? 1 : 0 }}>
          <Label color="grey-500" size="xs" fontWeight="SemiBold">
            <FormattedMessage
              id="sidebar.quick_actions"
              defaultMessage="Quick Actions"
            />
          </Label>
        </Box>
        <List>
          {quickActions.map((data, index) => (
            <SidebarMenuItem
              key={index}
              open={open}
              title={data.title}
              icon={data.icon}
              href={data.href}
            />
          ))}
        </List>
      </Box>

      <Box px="1.5rem" pb="2.81rem">
        <UserMenu expanded={open} onExpand={openDrawer} />
      </Box>
    </>
  );

  return (
    <Box height="100%" display="flex" position="relative">
      {/* Sidebar */}
      {/* Mobile */}
      <MuiDrawer
        anchor="right"
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        PaperProps={{
          sx: { width: "100%" },
        }}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        {drawer}
      </MuiDrawer>
      <Drawer
        component="aside"
        variant="permanent"
        open={open}
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        {drawer}
      </Drawer>
      {/* Content */}
      <Box
        component="main"
        display="flex"
        flexDirection="column"
        height="100%"
        flexGrow={1}
      >
        {!!mobile && (
          <Header
            height="4.25rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <img src={Logo} alt="Plowterra logo" height={30} aria-hidden />
            <IconButton onClick={handleDrawerClose}>
              <ListIcon size="1.25rem" />
            </IconButton>
          </Header>
        )}
        <Box height="100%" p={3} pb={mobile ? 0 : 3}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

const Header = styled(Box)`
  background: ${({ theme }) => theme.palette.background.paper};
  padding: 1.0625rem 1rem 1.0625rem 1rem;
`;

type SidebarMenuItemProps = {
  open: boolean;
  title: JSX.Element;
  icon: JSX.Element;
  href: string;
};
export const SidebarMenuItem = ({
  open,
  title,
  icon,
  href,
}: SidebarMenuItemProps) => {
  return (
    <ListItem disablePadding sx={{ display: "block", px: "1.5rem" }}>
      <ListItemButton
        sx={{
          justifyContent: open ? "initial" : "center",
          borderRadius: !open ? "50%" : undefined,
          height: "2.5rem",
          width: !open ? "2.5rem" : undefined,
          transition: "all 300ms",
          transitionTimingFunction: "ease-in-out",
        }}
        href={href}
        selected={window.location.pathname.includes(href)}
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
          primary={<BodyText fontWeight="Medium">{title}</BodyText>}
          sx={{ opacity: open ? 1 : 0 }}
        />
      </ListItemButton>
    </ListItem>
  );
};
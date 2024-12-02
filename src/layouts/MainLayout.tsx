import { BodyText, Label } from "ui/Typography";
import { Box, Divider, IconButton, List, useMediaQuery } from "@mui/material";
import { CSSObject, Theme, styled, useTheme } from "@mui/material/styles";
import {
  FilePlus,
  FileText,
  HandCoins,
  House,
  List as ListIcon,
  Plant,
  UserPlus,
  Users,
} from "@phosphor-icons/react";
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import { FormattedMessage } from "react-intl";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoDark from "../assets/images/LogoDark.svg";
import LogoLight from "../assets/images/Logo.svg";
import LogoSquareDark from "../assets/images/LogoSquareDark.svg";
import LogoSquareLight from "../assets/images/LogoSquare.svg";
import MuiDrawer from "@mui/material/Drawer";
import SidebarIconDark from "../assets/icons/SidebarIconDark.svg";
import SidebarIconLight from "../assets/icons/SidebarIcon.svg";
import UserMenu from "components/UserMenu";
import paths from "shared/paths";
import { useLocation } from 'react-router-dom';
import { usePersistedState } from "hooks/usePersistedState";
import { useThemMode } from "context/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UserProvider";

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
  const { user } = useUser();

  const location = useLocation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode } = useThemMode();
  const navigate = useNavigate();

  const [currPath, setCurrPath] = useState<string | undefined>();

  const [expanded, setOpen] = usePersistedState("sidebar-expanded", true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const open = mobile || expanded;

  const Logo = mode === "light" ? LogoLight : LogoDark;
  const LogoSquare = mode === "light" ? LogoSquareLight : LogoSquareDark;

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

  useEffect(() => {
    setCurrPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!user.farm._id) {
      navigate(paths.login);
    }
  }, [location.pathname]);

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
              <img
                src={Logo}
                alt="Plowterra logo"
                height={30}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
                aria-hidden
              />
            ) : (
              <img
                src={LogoSquare}
                alt="Plowterra logo"
                height={30}
                onClick={handleDrawerClose}
                style={{
                  cursor: "pointer",
                }}
                aria-hidden
              />
            )}
            {(!!open || !!mobileOpen) && (
              <IconButton
                onClick={handleDrawerClose}
                aria-label="Close sidebar"
              >
                <img
                  src={mode === "light" ? SidebarIconLight : SidebarIconDark}
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
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {sidebarItems.map(({ title, icon, href }, index) => (
            <SidebarMenuItem
              key={index}
              open={open}
              title={title}
              icon={icon}
              href={href}
              currPath={currPath}
              setCurrPath={(path) => {
                setCurrPath(path);
                if (mobile) {
                  setMobileOpen(!mobileOpen);
                }
              }}
            />
          ))}
        </List>
        {/* <Divider /> */}

        {open ? (
          <Box paddingLeft="1.5rem" mt="3rem">
            <Label color="grey-500" size="xs" fontWeight="SemiBold">
              <FormattedMessage
                id="sidebar.quick_actions"
                defaultMessage="Quick Actions"
              />
            </Label>
          </Box>
        ) : (
          <Divider
            sx={{
              marginX: "1.5rem",
              marginTop: "2.25rem",
              marginBottom: "0.75rem",
              height: "1.5rem",
            }}
          />
        )}

        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {quickActions.map((data, index) => (
            <SidebarMenuItem
              key={index}
              open={open}
              title={data.title}
              icon={data.icon}
              href={data.href}
              currPath={currPath}
              setCurrPath={setCurrPath}
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
      {/* Desktop */}
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
        minWidth={0}
        maxWidth="1640px"
        margin="auto"
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
              <ListIcon size="1.5rem" color={theme.palette.grey[900]} />
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
  currPath: string | undefined;
  setCurrPath: (href: string) => unknown;
};
export const SidebarMenuItem = ({
  open,
  title,
  icon,
  href,
  currPath,
  setCurrPath
}: SidebarMenuItemProps) => {
  return (
    <ListItem disablePadding sx={{ display: "block", px: "1.5rem" }}>
      <Link 
        to={href} 
        onClick={() => setCurrPath(href.split("?")[0])}
        style={{textDecoration: "none", color: "transparent"}}>
        <ListItemButton
          sx={{
            justifyContent: open ? "initial" : "center",
            borderRadius: !open ? "50%" : undefined,
            height: "2.5rem",
            width: !open ? "2.5rem" : undefined,
            transition: "all 300ms",
            transitionTimingFunction: "ease-in-out",
          }}
          selected={currPath === href ? true : (currPath?.includes("payroll") && href === "/payroll")}>
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}>
            {icon}
          </ListItemIcon>
        
          <ListItemText
            primary={<BodyText fontWeight="Medium">{title}</BodyText>}
            sx={{opacity: open ? 1 : 0}}
          />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};
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
  useMediaQuery,
} from "@mui/material"
import { CSSObject, Theme, styled, useTheme } from "@mui/material/styles"
import {
  FilePlus,
  FileText,
  HandCoins,
  House,
  List as ListIcon,
  Plant,
  UserPlus,
  Users,
} from "@phosphor-icons/react"
import { LANGUAGES, useLocale } from "context/LocaleProvider"

import { BodyText } from "ui/Typography"
import { FormattedMessage } from "react-intl"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Logo from "../assets/images/Logo.svg"
import LogoSquare from "../assets/images/LogoSquare.svg"
import MuiDrawer from "@mui/material/Drawer"
import { Outlet } from "react-router-dom"
import SidebarIcon from "../assets/icons/SidebarIcon.svg"
import paths from "shared/paths"
import { useState } from "react"
import { useUser } from "context/UserProvider"

const DRAWER_WIDTH = 240


const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
})

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
})

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

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
}))

const sidebarItems = [
  {
    title: <FormattedMessage id="sidebar.home" defaultMessage="Home" />,
    icon: <House />,
    href: paths.home,
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
]

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
]
const container = window !== undefined ? () => window.document.body : undefined

export default function MainLayout() {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("md"))

  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useUser()

  const { locale, selectLanguage } = useLocale()

  const handleDrawerClose = () => {
    if (mobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setOpen(!open)
    }
  }

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
              transform: "translateX(8px)",
              transition: "all 300ms",
            }}
            paddingRight={2}
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

                <ListItemText primary={title} sx={{ opacity: open ? 1 : 0 }} />
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
        <BodyText>{user.name}</BodyText>
        <FormControl fullWidth>
          <InputLabel id="language-label">Language</InputLabel>

          <Select
            labelId="language-label"
            id="language-select"
            value={locale}
            size="small"
            onChange={async (event) => {
              await selectLanguage(event.target.value as keyof typeof LANGUAGES)
            }}
            label="Language"
          >
            <MenuItem value={LANGUAGES.en}>English</MenuItem>
            <MenuItem value={LANGUAGES.es}>Spanish</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  )

  return (
    <Box height="100%" display="flex">
      <CssBaseline />
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
`

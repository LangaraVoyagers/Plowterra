import { Box, Divider, ListItem, styled } from "@mui/material";
import { ColorPartial } from "@mui/material/styles/createPalette";
import {
  CaretDown,
  CaretUp,
  GearSix,
  Moon,
  SignOut,
  Sun,
  User,
} from "@phosphor-icons/react";
import { useThemMode } from "context/ThemeProvider";
import { useUser } from "context/UserProvider";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { BodyText } from "ui/Typography";

const UserMenu = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const { mode, selectMode } = useThemMode();

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const setLightMode = () => selectMode("light");

  const setDarkMode = () => selectMode("dark");

  return (
    <Box position="relative">
      <StyledMenu
        position="absolute"
        top="-11.4rem"
        width="100%"
        p="0.5rem"
        display={open ? "flex" : "none"}
        gap="0.5rem"
        flexDirection="column"
      >
        {/* Profile */}
        <ListItem
          disablePadding
          sx={{ px: "0.5rem", py: "0.25rem", cursor: "pointer" }}
        >
          <Box display="flex" gap="0.5rem" alignItems="center">
            <User weight="bold" />

            <BodyText fontWeight="Medium">
              <FormattedMessage
                id="user.menu.profile"
                defaultMessage="Profile"
              />
            </BodyText>
          </Box>
        </ListItem>

        {/* Settings */}
        <ListItem
          disablePadding
          sx={{ px: "0.5rem", py: "0.25rem", cursor: "pointer" }}
        >
          <Box display="flex" gap="0.5rem" alignItems="center">
            <GearSix weight="bold" />

            <BodyText fontWeight="Medium">
              <FormattedMessage
                id="user.menu.settings"
                defaultMessage="Settings"
              />
            </BodyText>
          </Box>
        </ListItem>

        {/* Theme */}
        <ListItem
          disablePadding
          sx={{ px: "0.5rem", py: "0.25rem", cursor: "pointer" }}
          onClick={() => {
            if (mode === "light") {
              setDarkMode();
            } else {
              setLightMode();
            }
            handleClick();
          }}
        >
          <Box display="flex" gap="0.5rem" alignItems="center">
            {mode === "light" ? <Moon weight="bold" /> : <Sun weight="bold" />}

            <BodyText fontWeight="Medium">
              <FormattedMessage id="user.menu.theme" defaultMessage="Theme" />
            </BodyText>
          </Box>
        </ListItem>

        <Divider />

        <ListItem
          disablePadding
          sx={{ px: "0.5rem", py: "0.25rem", cursor: "pointer" }}
        >
          <Box display="flex" gap="0.5rem" alignItems="center">
            <SignOut weight="bold" />

            <BodyText fontWeight="Medium">
              <FormattedMessage
                id="user.menu.log_out"
                defaultMessage="Log out"
              />
            </BodyText>
          </Box>
        </ListItem>
      </StyledMenu>

      <StyledContainer
        aria-controls={open ? "user-menu-container" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        display="flex"
        gap="0.75rem"
        onClick={handleClick}
      >
        <Avatar alignSelf="center">
          <BodyText size="xs" fontWeight="SemiBold">
            {user.name
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </BodyText>
        </Avatar>
        <Box display="flex" flexDirection="column">
          <BodyText
            component="span"
            size="md"
            fontWeight="Medium"
            color="grey-700"
          >
            {user.name}
          </BodyText>
          <BodyText size="xs" color="grey-500">
            {user.farm.name}
          </BodyText>
        </Box>
        <Box display="flex" flexDirection="column" flex={1}>
          <CaretUp weight="bold" size="0.5rem" />
          <CaretDown weight="bold" size="0.5rem" />
        </Box>
      </StyledContainer>
    </Box>
  );
};

const StyledContainer = styled(Box)`
  border-radius: 0.75rem;
  padding: 1rem 1.12rem;
  border: 1px solid ${({ theme }) => theme.palette.grey[200]};
  background: ${({ theme }) => theme.palette.background.paper};
  cursor: pointer;
`;

const StyledMenu = styled(Box)`
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.palette.background.paper};
  box-shadow: ${({ theme }) =>
    theme.palette.mode === "light"
      ? "0px 0px 1px 0px rgba(29, 33, 45, 0.3), 0px 1px 4px 0px rgba(29, 33, 45, 0.3)"
      : "0px 0px 3px 0px rgba(255, 255, 255, 0.5), 0px 0px 6px 0px rgba(255, 255, 255, 0.5)"};
`;

const Avatar = styled(Box)<{
  background?: string;
  foreground?: string;
  size?: string;
}>`
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ background, theme }) =>
    background || (theme.palette.secondary as ColorPartial)[200]};
  color: ${({ foreground, theme }) =>
    foreground || (theme.palette.secondary as ColorPartial)[800]} !important;
  width: ${({ size }) => size || "2rem"};
  height: ${({ size }) => size || "2rem"};
  flex-shrink: 0;

  .MuiTypography-root {
    color: ${({ foreground, theme }) =>
      foreground || (theme.palette.secondary as ColorPartial)[800]} !important;
  }
`;

export default UserMenu;

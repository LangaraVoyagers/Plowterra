import React from "react"
import {
  Drawer,
  Button,
  DrawerProps,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BodyText, Display } from "ui/Typography"
import DrawerContainer from "./DrawerContainer";

interface ConfirmationDrawerProps extends DrawerProps {
  image: string;
  imageStyle?: React.CSSProperties;
  title: string;
  message: string | React.ReactNode;
  backButtonTitle: string;
  onClose: () => void;
}

const ConfirmationDrawer: React.FC<ConfirmationDrawerProps> = ({
  image,
  title,
  message,
  backButtonTitle,
  imageStyle = {},
  ...rest
}) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Drawer
      anchor="right"
      PaperProps={{
        sx: {
          width: desktop ? 500 : "100%",
        },
      }}
      {...rest}
    >
      <DrawerContainer>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          margin="auto"
          gap="2.81rem"
        >
          <img
            src={image}
            alt="Icon Picker"
            style={{
              width: "221px",
              height: "229px",
              ...imageStyle,
            }}
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="1.5rem"
            textAlign="center"
          >
            <Display color="grey-800" size="sm" fontWeight="SemiBold">
              {title}
            </Display>
            <BodyText
              size="md"
              color="grey-800"
              fontWeight="Medium"
              width="16rem"
            >
              {message}
            </BodyText>
          </Box>
          <Box paddingTop="1.19rem">
            <Button
              onClick={rest.onClose}
              variant="contained"
              color="primary"
              autoFocus
            >
              {backButtonTitle}
            </Button>
          </Box>
        </Box>
      </DrawerContainer>
    </Drawer>
  );
};

export default ConfirmationDrawer

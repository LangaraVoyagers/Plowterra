import { Box, BoxProps, styled, useMediaQuery, useTheme } from "@mui/material";
import { useThemMode } from "context/ThemeProvider";
import LogoDark from "../assets/images/LogoDark.svg";
import LogoLight from "../assets/images/Logo.svg";
type DrawerContainerProps = BoxProps & {
  footer?: React.ReactNode;
};

const DrawerContainer = ({
  footer,
  children,
  ...props
}: DrawerContainerProps) => {
  const { mode } = useThemMode();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const tablet = useMediaQuery(theme.breakpoints.up("sm"));

  const Logo = mode === "light" ? LogoLight : LogoDark;

  return (
    <Box
      {...props}
      display="flex"
      flexDirection="column"
      width={desktop ? 500 : "100%"}
      height="100%"
    >
      {!desktop && (
        <Header height="4.25rem" display="flex" alignItems="center">
          <img src={Logo} alt="Plowterra logo" height={30} aria-hidden />
        </Header>
      )}
      <Box
        display="flex"
        flexDirection="column"
        paddingX={tablet ? "1.5rem" : "1rem"}
        paddingY={tablet ? "2.25rem" : "1.5rem"}
        gap={3}
        flex={1}
      >
        {children}
      </Box>

      {!!footer && (
        <Footer
          position="sticky"
          bottom={0}
          paddingY={tablet ? "1.625rem" : "1.25rem"}
          paddingX={tablet ? "3rem" : "1rem"}
        >
          {footer}
        </Footer>
      )}
    </Box>
  );
};

export default DrawerContainer;

const Footer = styled(Box)`
  background: ${({ theme }) => theme.palette.grey[50]};
  border-top: 1px solid ${({ theme }) => theme.palette.grey[200]};
`;

const Header = styled(Box)`
  background: ${({ theme }) => theme.palette.grey[50]};
  padding: 1.0625rem 1rem 1.0625rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey[200]};
`;

import { Box, BoxProps, styled, useMediaQuery, useTheme } from "@mui/material";

type DrawerContainerProps = BoxProps & {
  footer?: React.ReactNode;
};

const DrawerContainer = ({
  footer,
  children,
  ...props
}: DrawerContainerProps) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const tablet = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box
      {...props}
      display="flex"
      flexDirection="column"
      width={desktop ? 600 : "100%"}
      height="100%"
    >
      <Box
        display="flex"
        flexDirection="column"
        padding={tablet ? "3rem" : "1rem"}
        gap={3}
        flex={1}
      >
        {children}
      </Box>

      {!!footer && (
        <Footer
          position="sticky"
          bottom={0}
          paddingY="1rem"
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
  background: ${({ theme }) => theme.palette.background.paper};
  border-top: 1px solid ${({ theme }) => theme.palette.grey[200]};
`;

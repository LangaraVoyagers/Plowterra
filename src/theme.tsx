import { ThemeOptions, createTheme } from "@mui/material/styles";
import { CaretRight } from "@phosphor-icons/react";

const white = "#FFFFFF";
const black = "#000000";
const background = "#F1EFEE";

const colors = {
  white,
  black,
  background,
  primary: {
    50: "#E6EFEC",
    100: "#B2CDC4",
    200: "#8CB5A7",
    300: "#58937F",
    400: "#377E66",
    500: "#055E40",
    600: "#05563A",
    700: "#04432D",
    800: "#033423",
    900: "#02271B",
    contrastText: white,
  },
  secondary: {
    50: "#FCF4E6",
    100: "#F5DDB0",
    200: "#F0CC8A",
    300: "#EAB554",
    400: "#E5A633",
    500: "#DF9000",
    600: "#CB8300",
    700: "#9E6600",
    800: "#7B4F00",
    900: "#5E3C00",
  },
  error: {
    50: "#FBE9E9",
    100: "#F2BCBA",
    200: "#EB9B98",
    300: "#E26E6A",
    400: "#DD514D",
    500: "#D42620",
    600: "#C1231D",
    700: "#971B17",
    800: "#751512",
    900: "#59100D",
  },
  warning: {
    50: "#FFFAEB",
    100: "#FEF0C7",
    200: "#FEDF89",
    300: "#FEC84B",
    400: "#FDB022",
    500: "#F79009",
    600: "#DC6803",
    700: "#B54708",
    800: "#93370D",
    900: "#7A2E0E",
  },
  success: {
    50: "#E8F7F0",
    100: "#B7E7D1",
    200: "#94DCBA",
    300: "#64CB9B",
    400: "#45C188",
    500: "#17B26A",
    600: "#15A260",
    700: "#107E4B",
    800: "#0D623A",
    900: "#0A4B2D",
  },
  grey: {
    50: "#FBFBFB",
    100: "#F5F5F4",
    200: "#E7E5E4",
    300: "#D7D3D0",
    400: "#A9A29D",
    500: "#79716B",
    600: "#57534E",
    700: "#44403C",
    800: "#292524",
    900: "#1C1917",
  },
};

const themeOptions: ThemeOptions = {
  palette: {
    primary: colors.primary,
    secondary: { ...colors.secondary, main: colors.secondary[500] },
    error: colors.error,
    warning: colors.warning,
    grey: colors.grey,
    success: colors.success,
    background: {
      default: colors.background,
    },
  },
  typography: {
    allVariants: {
      fontFamily: "PlusJakartaSans, Inter",
    },
    h1: {
      fontSize: "3rem",
      lineHeight: "3.75rem",
      letterSpacing: "-0.036rem",
    },
    h2: {
      fontSize: "2.25rem",
      lineHeight: "2.75rem",
      letterSpacing: "-0.045rem",
    },
    h3: {
      fontSize: "1.875rem",
      lineHeight: "2.375rem",
    },
    h4: {
      fontSize: "1.5rem",
      lineHeight: "2rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: " 1.5rem",
    },
    body2: {},
    overline: {
      fontSize: "0.75rem",
      lineHeight: "1.125rem",
      letterSpacing: "0.0225rem",
    },
    // Disable variants
    h5: undefined,
    h6: undefined,
  },
  components: {
    MuiCssBaseline: {
      // Autofill temporary colors. White bg with Black text
      styleOverrides: `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
        -webkit-text-fill-color: #000000 !important;
      }`,
    },
    MuiBreadcrumbs: {
      defaultProps: {
        separator: <CaretRight size={16} />,
      },
    },
  },
};
const theme = createTheme(themeOptions);

export default theme;

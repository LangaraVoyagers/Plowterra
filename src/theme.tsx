import { createTheme } from '@mui/material/styles';
import { red, blue, orange } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: orange[500],
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    allVariants: {
      fontFamily: "PlusJakartaSans, Inter",
      fontVariantNumeric: "lining-nums tabular-nums",
      fontFeatureSettings: "'liga' off",
    },
    // Display/lg
    h1: {
      fontSize: "3rem",
      lineHeight: "3.75rem",
      letterSpacing: "-0.048rem",
    },
    // Display/md
    h2: {
      fontSize: "2.25rem",
      lineHeight: "2.75rem",
      letterSpacing: "-0.045rem",
    },
    // Display/sm

    h3: {
      fontSize: "1.875rem",
      lineHeight: "2.375rem",
      letterSpacing: "-0.01875rem",
    },
    // Display/xs
    h4: {
      fontSize: "1.5rem",
      lineHeight: "2rem",
    },
    // Text/md
    body1: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
    },
    // Text/sm
    body2: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
    },
    // Label 2 -> by default is uppercase
    overline: {
      fontSize: "0.75rem",
      lineHeight: "1.125rem",
      letterSpacing: "0.03rem",
      fontWeight: 500,
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
  },
});

export default theme;
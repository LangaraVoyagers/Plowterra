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
      // fontFamily: "Plus Jakarta Sans",
    },
    h1: {
      fontSize: "2.75rem",
      lineHeight: "3.5rem",
      letterSpacing: "-0.033rem",
    },
    h2: {
      fontSize: "2rem",
      lineHeight: "3.5rem",
      letterSpacing: "-0.033rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: " 1.5rem",
    },
    overline: {
      fontSize: "0.75rem",
      lineHeight: "1.125rem",
      letterSpacing: "0.0225rem",
    },
    // Disable variants
    h3: undefined,
    h4: undefined,
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
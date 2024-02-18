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
});

export default theme;
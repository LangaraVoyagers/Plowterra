import { PaletteMode, ThemeOptions } from "@mui/material";
import { CaretRight } from "@phosphor-icons/react";
import dark, {
  background as darkBackground,
  white as darkWhite,
} from "shared/palette/dark";
import light, {
  background as lightBackground,
  white as lightWhite,
} from "shared/palette/light";

const themeOptions = (mode: PaletteMode): ThemeOptions => {
  const colors = mode === "dark" ? dark : light;
  const background = mode === "dark" ? darkBackground : lightBackground;
  const white = mode === "dark" ? darkWhite : lightWhite;
  return {
    palette: {
      mode: mode,
      primary: colors.primary,
      secondary: {
        ...colors.secondary,
        main: colors.secondary[500],
      },
      error: colors.error,
      warning: colors.warning,
      grey: colors.grey,
      success: colors.success,
      background: {
        default: background,
        paper: white,
      },
    },
    typography: {
      allVariants: {
        fontFamily:
          "PlusJakartaSans, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
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
          -webkit-box-shadow: 0 0 0 30px ${background} inset !important;
          -webkit-text-fill-color: ${colors.grey[900]} !important;
        }
  
        ::selection {
          background: ${colors.secondary[100]};
        }
        `,
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            styles: `
              :focus-within {
                outline: 3px solid ${colors.primary[100]} !important;
              }

             :active{
              outline: 3px solid ${colors.primary[100]} !important;
             }

             ::selection {
              outline: 3px solid ${colors.primary[100]} !important;
            }
          `,
          },
        },
        variants: [
          {
            props: {},
            style: ({ theme }) => {
              return {
                background: theme.palette.background.paper,
                borderRadius: "0.5rem !important",
                border: theme.palette.grey[50],
              };
            },
          },
        ],
      },
      MuiTypography: {
        variants: [
          {
            props: { variant: "h1" },
            style: ({ theme }) => {
              const { fontSize, lineHeight, letterSpacing } =
                theme.typography.h3;
              return {
                [theme.breakpoints.down("sm")]: {
                  fontSize,
                  lineHeight,
                  letterSpacing,
                },
              };
            },
          },
          {
            props: { variant: "h2" },
            style: ({ theme }) => {
              const { fontSize, lineHeight, letterSpacing } =
                theme.typography.h4;
              return {
                [theme.breakpoints.down("sm")]: {
                  fontSize,
                  lineHeight,
                  letterSpacing,
                },
              };
            },
          },
          {
            props: { variant: "h3" },
            style: ({ theme }) => {
              const { fontSize, lineHeight, letterSpacing } =
                theme.typography.body1;
              return {
                [theme.breakpoints.down("sm")]: {
                  fontSize,
                  lineHeight,
                  letterSpacing,
                },
              };
            },
          },
          {
            props: { variant: "h4" },
            style: ({ theme }) => {
              const { fontSize, lineHeight, letterSpacing } =
                theme.typography.body1;
              return {
                [theme.breakpoints.down("sm")]: {
                  fontSize,
                  lineHeight,
                  letterSpacing,
                },
              };
            },
          },
          {
            props: { variant: "body1" },
            style: ({ theme }) => {
              const { fontSize, lineHeight, letterSpacing } =
                theme.typography.body2;
              return {
                [theme.breakpoints.down("sm")]: {
                  fontSize,
                  lineHeight,
                  letterSpacing,
                },
              };
            },
          },
          //overline or label handled in the Label component
        ],
      },
      MuiListItemButton: {
        variants: [
          {
            props: {
              selected: true,
            },
            style: () => {
              return {
                background: `${colors.grey[600]} !important`,
                borderRadius: "0.5rem",
                ".MuiTypography-root": {
                  color: `${white} !important`,
                },
                ".MuiListItemIcon-root svg": {
                  color: `${white} !important`,
                },
              };
            },
          },
          {
            props: {
              selected: false,
            },
            style: {
              borderRadius: "0.5rem",
              ".MuiTypography-root": {
                color: `${colors.grey[800]} !important`,
              },
              ".MuiListItemIcon-root svg": {
                color: `${colors.grey[800]} !important`,
              },
              ":hover": {
                background: `${colors.grey[200]} !important`,
              },
            },
          },
        ],
      },
      MuiBreadcrumbs: {
        defaultProps: {
          separator: (
            <CaretRight size={16} weight="bold" color={colors.grey[600]} />
          ),
        },
        variants: [
          {
            props: {},
            style: {
              color: colors.grey[500],
            },
          },
        ],
      },
      MuiButton: {
        defaultProps: {
          disableTouchRipple: true,
          disableFocusRipple: true,
        },
        variants: [
          {
            props: { size: "small" },
            style: () => {
              return {
                padding: "0.75rem 1rem",
                lineHeight: "1.25rem",
              };
            },
          },
          {
            props: { size: "medium" },
            style: ({ theme }) => {
              return {
                padding: "1rem",
                lineHeight: "1.5rem",
                [theme.breakpoints.down("sm")]: {
                  padding: "0.75rem 1rem",
                  lineHeight: "1.25rem",
                },
              };
            },
          },
          {
            props: { variant: "outlined" },
            style: ({ ownerState }: any) => {
              if (!Object.keys(colors).includes(ownerState.color)) {
                return {};
              }
              const color = (ownerState.color ??
                "primary") as keyof typeof colors;

              return {
                backgroundColor: white,
                color: colors[color][500],
                border: `solid 1px ${colors[color][500]}`,
                ":hover": {
                  backgroundColor: white,
                  borderColor: colors[color][700],
                  color: colors[color][700],
                },
                ":active": {
                  borderColor: colors[color][300],
                  backgroundColor: colors[color][50],
                  color: colors[color][800],
                },
                ":focus-visible": {
                  borderColor: colors[color][500],
                  backgroundColor: white,
                  color: colors[color][500],
                },
                ":disabled": {
                  borderColor: colors[color][100],
                  color: colors[color][200],
                },
              };
            },
          },
          {
            props: { variant: "text" },
            style: ({ ownerState }: any) => {
              if (!Object.keys(colors).includes(ownerState.color)) {
                return {};
              }
              const color = (ownerState.color ??
                "primary") as keyof typeof colors;

              return {
                color: colors[color][500],
                ":hover": {
                  backgroundColor: colors[color][50],
                  color: colors[color][700],
                },
                ":active": {
                  backgroundColor: colors[color][50],
                  color: colors[color][800],
                },
                ":focus-visible": {
                  backgroundColor: white,
                  color: colors[color][500],
                },
                ":disabled": {
                  color: colors[color][200],
                },
              };
            },
          },
          {
            props: { variant: "contained" },
            style: ({ ownerState }: any) => {
              if (!Object.keys(colors).includes(ownerState.color)) {
                return {};
              }
              const color = (ownerState.color ??
                "primary") as keyof typeof colors;

              return {
                backgroundColor: colors[color][500],
                color: white,
                ":hover": {
                  backgroundColor: colors[color][700],
                },
                ":active": {
                  backgroundColor: colors[color][800],
                },
                ":focus-visible": {
                  backgroundColor: colors[color][500],
                },
                ":disabled": {
                  backgroundColor: colors[color][200],
                  color: white,
                },
              };
            },
          },
        ],
        styleOverrides: {
          root: {
            fontSize: "1rem",
            borderRadius: "0.5rem",
            textTransform: "capitalize",
            fontWeight: 500,
            minWidth: "10rem",
            height: "fit-content",
            ":active": {
              outline: "3px solid transparent",
              outlineColor: colors.primary[100],
              boxShadow: "0px 0px 0px 3px rgba(255, 255, 255, 0.60)",
            },
            ":focus-visible": {
              outline: "3px solid transparent",
              outlineOffset: "1px",
              outlineColor: colors.primary[100],
              boxShadow: "0px 0px 0px 3px rgba(255, 255, 255, 0.60)",
            },
          },
          sizeLarge: undefined,
          sizeMedium: {
            padding: "1rem",
            lineHeight: "1.5rem",
          },
          sizeSmall: {
            padding: "0.75rem 1rem",
            lineHeight: "1.25rem",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
          },
        },
      },
    },
  };
};

export default themeOptions;

import React, { createContext, useContext, useMemo } from "react";
import { usePersistedState } from "hooks/usePersistedState";
import { PaletteMode, createTheme } from "@mui/material";
import { ThemeProvider as MUIThemeProvider } from "@emotion/react";
import themeOptions from "theme";
import { CssBaseline } from "@mui/material";

export const ThemeContext = createContext<{
  mode: PaletteMode;
  selectMode: (mode: PaletteMode) => void;
} | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = usePersistedState<PaletteMode>("theme", "light");

  const theme = useMemo(() => createTheme(themeOptions(mode)), [mode]);

  const selectMode = async (value: PaletteMode) => {
    setMode(value);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        selectMode,
      }}
    >
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemMode = () => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("ThemeContext must be used within a ThemeProvider");
  }

  return context;
};

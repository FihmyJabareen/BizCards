import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const CustomThemeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
});

export function useCustomTheme() {
  return useContext(CustomThemeContext);
}

export default function CustomThemeProvider({ children }) {
  const getInitial = () => {
    const saved = localStorage.getItem("colorMode");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [mode, setMode] = useState(getInitial);

  const toggleColorMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("colorMode", next);
      return next;
    });
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        shape: { borderRadius: 10 },
        typography: { fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif' },
        components: {
          MuiPaper: { styleOverrides: { root: { transition: "background-color .2s ease" } } },
        },
      }),
    [mode]
  );

  const value = useMemo(() => ({ mode, toggleColorMode }), [mode, toggleColorMode]);

  return (
    <CustomThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
}

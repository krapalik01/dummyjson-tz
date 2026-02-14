import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2F3EEB" },
    text: { primary: "#111827", secondary: "#6B7280" },
    divider: "#E5E7EB",
    background: { default: "#EEF0F4", paper: "#ffffff" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontSize: 13,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 800,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: "0 18px 60px rgba(17,24,39,0.10)",
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            background: "#fff",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: "none", fontWeight: 700 },
      },
    },
  },
});

import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "./App.css";

const theme = createTheme({
  typography: {
    fontFamily: "'Londrina Solid', sans-serif", // Apply font globally
    button: {
      fontFamily: "'Londrina Solid', sans-serif", // Apply font to buttons
    },
    h1: {
      fontFamily: "'Londrina Solid', sans-serif", // Apply font to h1 (headers)
    },
    h2: {
      fontFamily: "'Londrina Solid', sans-serif", // Apply font to h2
    },
    body1: {
      fontFamily: "'Londrina Solid', sans-serif", // Apply font to body text
    },
    // Apply to other typography styles if necessary (e.g., h3, body2, etc.)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Londrina Solid', sans-serif", // Override MUI Button globally
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: "'Londrina Solid', sans-serif", // Override MUI TextField globally
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Londrina Solid', sans-serif", // Override MUI Typography globally
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: "'Londrina Solid', sans-serif", // Override MUI Link globally
        },
      },
    },
    // Override other components if necessary
  },
});

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <div className="root-container">
        <Header />
        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default App;

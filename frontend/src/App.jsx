import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "./App.css";
const theme = createTheme({
  typography: {
    fontFamily: "'Chilanka', sans-serif", // Apply 'Chilanka' font globally
    button: {
      fontFamily: "'Chilanka', sans-serif", // Apply 'Chilanka' font to buttons
    },
    h1: {
      fontFamily: "'Chilanka', sans-serif", // Apply 'Chilanka' font to h1 headers
    },
    h2: {
      fontFamily: "'Chilanka', sans-serif", // Apply 'Chilanka' font to h2 headers
    },
    body1: {
      fontFamily: "'Chilanka', sans-serif", // Apply 'Chilanka' font to body text
    },
    // Update other typography styles as necessary (e.g., h3, body2, etc.)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Chilanka', sans-serif",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: "'Chilanka', sans-serif",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Chilanka', sans-serif",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: "'Chilanka', sans-serif",
        },
      },
    },
  },
});


const App = () => {

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

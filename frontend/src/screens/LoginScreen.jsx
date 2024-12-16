import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  InputAdornment,
  Link as MuiLink,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    pass: "",
  });

  const dispatch = useDispatch();

  const [login,] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/games"); // Redirect to the main game page after login
    }
  }, [navigate, userInfo]);

  const submitFn = async (event) => {
    event.preventDefault();

    // Regular expression for email validation
    const emailPattern = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

    // Check if form data is valid
    if (
      emailPattern.test(formData.email) &&
      formData.pass.length >= 3
    ) {
      try {
        const res = await login({
          email: formData.email,
          password: formData.pass,
        }).unwrap();

        dispatch(setCredentials({ ...res }));
      } catch (err) {
        console.log("error", err);
        toast.error(err?.data?.message || err.error);
      }
    } else {
      setValidated(true);
    }
  };

  const chngFn = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Grid
      container
      style={{
        height: "100vh",
        backgroundColor: "#0080FF",
        backgroundImage: "url('/images/background.png')", // Set background image
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Left Side */}
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <img
          src="/images/fellow-games.png"
          alt="Fellows Games"
          style={{ position: "absolute", top: 100, left: 100, width: "60%" }}
        />
        <img
          src="/images/games.png"
          alt="Games"
          style={{ position: "absolute", top: 40, left: 100, width: "60%" }}
        />
      </Grid>

      {/* Right Side */}
      <Grid
        item
        xs={12}
        md={6}
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          component="form"
          onSubmit={submitFn}
          noValidate
          sx={{ width: 400, p: 4, borderRadius: 2 }}
        >

          <TextField
            id="email"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={chngFn}
            required
            fullWidth
            margin="normal"
            error={validated && !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(formData.email)}
            helperText={
              validated && !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
                ? "Please enter a valid email address."
                : ""
            }
            variant="standard"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiInputBase-root": {
                color: "white", // Input text color
                fontSize: "18px",
                "&:before": {
                  borderBottom: "1px solid white", // Default bottom border
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottom: "1px solid white", // Bottom border when hovered
                },
                "&.Mui-focused:before": {
                  borderBottom: "1px solid white", // Bottom border when focused
                },
              },
              "& .MuiInputLabel-root": {
                color: "white", // Label color
                fontSize: "20px",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white", // Label color when focused
              },
              "& .MuiFormHelperText-root": {
                color: "white", // Helper text color
              },
              "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                color: "white", // Icon color
              },
            }}
          />

          <TextField
            id="password"
            label="Password"
            type="password"
            name="pass"
            value={formData.pass}
            onChange={chngFn}
            required
            fullWidth
            margin="normal"
            error={validated && formData.pass.length < 3}
            helperText={
              validated && formData.pass.length < 3
                ? "Password must be at least 3 characters long."
                : ""
            }
            variant="standard"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiInputBase-root": {
                color: "white", // Input text color
                fontSize: "18px",
                "&:before": {
                  borderBottom: "1px solid white", // Default bottom border
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottom: "1px solid white", // Bottom border when hovered
                },
                "&.Mui-focused:before": {
                  borderBottom: "1px solid white", // Bottom border when focused
                },
              },
              "& .MuiInputLabel-root": {
                color: "white", // Label color
                fontSize: "20px",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white", // Label color when focused
              },
              "& .MuiFormHelperText-root": {
                color: "white", // Helper text color
              },
              "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                color: "white", // Icon color
              },
            }}
          />

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            {/* Register Button */}
            <Button
              type="submit"
              variant="outlined"
              sx={{
                borderRadius: "50px", // Fully rounded corners
                padding: "10px 30px", // Adjust padding to suit your design
                textTransform: "none", // Prevent uppercase text
                color: "white",
                borderColor: "white", // White border
                fontSize: "20px",
                "&:hover": {
                  borderColor: "white", // Keep the border white on hover
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Optional background change on hover
                },
              }}
            >
              Login
            </Button>

            {/* Play as Guest Button */}
            <Button
              onClick={() => navigate("/games")}
              variant="outlined"
              sx={{
                borderRadius: "50px", // Fully rounded corners
                padding: "10px 30px", // Adjust padding to suit your design
                textTransform: "none", // Prevent uppercase text
                color: "white",
                borderColor: "white", // White border
                fontSize: "20px",
                "&:hover": {
                  borderColor: "white", // Keep the border white on hover
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Optional background change on hover
                },
              }}
            >
              Play as Guest
            </Button>
          </Box>

          {/* Link to register page */}
          <Box textAlign="center" marginTop={2}>
            <MuiLink component={Link} to="/register" sx={{ color: "white", fontSize: "20px" }}>
              Don't have an account? Register
            </MuiLink>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginScreen;

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
    name: "",
    pass: "",
  });

  const dispatch = useDispatch();

  const [login,] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/games");
    }
  }, [navigate, userInfo]);

  const submitFn = async (event) => {
    event.preventDefault();


    if (
      formData.name &&
      formData.pass
    ) {
      try {
        const res = await login({
          name: formData.name,
          password: formData.pass,
        }).unwrap();

        dispatch(setCredentials({ ...res }));
      } catch (err) {
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
        backgroundColor: "#0080FF",
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
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
            id="name"
            label="name"
            type="name"
            name="name"
            value={formData.email}
            onChange={chngFn}
            required
            fullWidth
            margin="normal"

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
                color: "white",
                fontSize: "18px",
                "&:before": {
                  borderBottom: "1px solid white",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottom: "1px solid white",
                },
                "&.Mui-focused:before": {
                  borderBottom: "1px solid white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
                fontSize: "20px",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
              "& .MuiFormHelperText-root": {
                color: "white",
              },
              "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                color: "white",
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
                color: "white",
                fontSize: "18px",
                "&:before": {
                  borderBottom: "1px solid white",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottom: "1px solid white",
                },
                "&.Mui-focused:before": {
                  borderBottom: "1px solid white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
                fontSize: "20px",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
              "& .MuiFormHelperText-root": {
                color: "white",
              },
              "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                color: "white",
              },
            }}
          />

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Button
              type="submit"
              variant="outlined"
              sx={{
                borderRadius: "50px",
                padding: "10px 30px",
                textTransform: "none",
                color: "white",
                borderColor: "white",
                fontSize: "20px",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Login
            </Button>

            <Button
              onClick={() => navigate("/games")}
              variant="outlined"
              sx={{
                borderRadius: "50px",
                padding: "10px 30px",
                textTransform: "none",
                color: "white",
                borderColor: "white",
                fontSize: "20px",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Play as Guest
            </Button>
          </Box>

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

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  InputAdornment,
  FormControl,
  RadioGroup,
  FormLabel,
  Radio,
  FormControlLabel,
  Link as MuiLink,
} from "@mui/material";
import { AccountCircle, Email, Lock } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    pass: "",
    confimPass: "",
    email: "",
    userType: "general",
  });

  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();


  const submitFn = async (event) => {
    if (formData.email) {
      event.preventDefault();

      const emailPattern = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

      if (
        formData.name &&
        emailPattern.test(formData.email) &&
        formData.pass.length >= 3 &&
        formData.pass === formData.confimPass
      ) {
        try {
          await register({
            name: formData.name,
            email: formData.email,
            password: formData.pass,
            userType: formData.userType,
          }).unwrap();
          toast.success("Registration successful! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      } else {
        setValidated(true);
      }
    } else {
      event.preventDefault();


      if (
        formData.name &&
        formData.pass.length >= 3 &&
        formData.pass === formData.confimPass
      ) {
        try {
          const res = await register({
            name: formData.name,
            email: null,
            password: formData.pass,
            userType: formData.userType,
          }).unwrap();
          toast.success("Registration successful! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      } else {
        setValidated(true);
      }
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
    <Grid container style={{ backgroundColor: "#0080FF", backgroundImage: "url('/images/background.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
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
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          component="form"
          onSubmit={submitFn}
          noValidate
          sx={{
            width: 400,
            p: 4,
            borderRadius: 2,
            position: "relative",
            backdropFilter: "blur(5px)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ color: "#FFFFFF",}}
          >
            Registration :
          </Typography>

          <TextField
            id="input-with-icon-textfield"
            label="Username"
            name="name"
            value={formData.name}
            onChange={chngFn}
            required
            fullWidth
            margin="normal"
            error={validated && !formData.name}
            helperText={
              validated && !formData.name ? "Please enter a valid username." : ""
            }
            variant="standard"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
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
            id="input-with-icon-textfield"
            label={`Email ${formData.userType === "fellow" ? "(Mandatory)" : "(Optional)"}`}
            type="email"
            name="email"
            value={formData.email}
            onChange={chngFn}

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
            id="input-with-icon-textfield"
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

          <TextField
            id="input-with-icon-textfield"
            label="Confirm Password"
            type="password"
            name="confimPass"
            value={formData.confimPass}
            onChange={chngFn}
            required
            fullWidth
            margin="normal"
            error={validated && formData.confimPass !== formData.pass}
            helperText={
              validated && formData.confimPass !== formData.pass
                ? "Passwords do not match."
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


          <FormControl fullWidth margin="normal">
            <RadioGroup
              name="userType"
              value={formData.userType}
              onChange={chngFn}
              row
            >
              <FormControlLabel
                value="general"
                control={
                  <Radio
                    sx={{
                      '&.Mui-checked': {
                        color: 'white',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      }
                    }}
                  />
                }
                label="General User"
                sx={{
                  color: 'white',
                  '&.Mui-checked': {
                    color: 'white',
                  }
                }}
              />
              <FormControlLabel
                value="fellow"
                control={
                  <Radio
                    sx={{
                      '&.Mui-checked': {
                        color: 'white',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      }
                    }}
                  />
                }
                label="Fellow User"
                sx={{
                  color: 'white',
                  '&.Mui-checked': {
                    color: 'white',
                  }
                }}
              />
            </RadioGroup> 
          </FormControl>

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
              {isLoading ? <CircularProgress size={24} /> : "Register"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/games")}
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

          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item>
              <MuiLink
                component={Link}
                to="/login"
                sx={{
                  textDecoration: "none",
                  fontSize: "20px",
                  color: "white",
                }}
              >
                Already have an account? Login
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterScreen;
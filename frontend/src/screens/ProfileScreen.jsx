import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const ProfileScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 3) {
      setValidated(true);
      return;
    }

    try {
      const res = await updateProfile({
        userId: userInfo._id,
        password,
      }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <Grid
      container
    >
      <Grid
        item
        xs={12}
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          component="form"
          onSubmit={submitHandler}
          noValidate
          sx={{
            width: 400,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "white", textAlign: "center", mb: 2 }}
          >
            Update Profile
          </Typography>

          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            error={validated && password.length < 3}
            helperText={
              validated && password.length < 3
                ? "Password must be at least 3 characters long."
                : ""
            }
            variant="standard"
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
            }}
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            error={validated && password !== confirmPassword}
            helperText={
              validated && password !== confirmPassword
                ? "Passwords do not match."
                : ""
            }
            variant="standard"
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
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              type="submit"
              variant="outlined"
              disabled={isLoading}
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
              Update Profile
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProfileScreen;

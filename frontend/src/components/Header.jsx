import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation here
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current route

  const [logoutApiCall] = useLogoutMutation();
  const [activeButton, setActiveButton] = useState(""); // Track active button

  // Handle logout
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login"); // Navigate to login without reload
    } catch (err) {
      console.error(err);
    }
  };

  // Navigate handlers
  const loginHandler = () => {
    navigate("/login"); // Navigate to login without reload
  };

  const signupHandler = () => {
    navigate("/register"); // Navigate to register without reload
  };

  // Set active button when component loads based on current path
  useEffect(() => {
    // Set activeButton based on current route (location.pathname)
    if (location.pathname === "/games") {
      setActiveButton("games");
    } else if (location.pathname === "/profile") {
      setActiveButton("profile");
    } else if (location.pathname === "/products") {
      setActiveButton("products");
    } else if (location.pathname === "/leaderboard") {
      setActiveButton("leaderboard");
    } else if (userInfo) {
      setActiveButton("games"); // Default to "games" if logged in
    }
  }, [location.pathname, userInfo]); // Re-run whenever the location changes or userInfo changes

  // Text color when active
  const activeTextStyle = {
    color: "#FAD700", // Yellow color for active text
  };

  // Default text color
  const defaultTextStyle = {
    color: "white", // White color for inactive text
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section: Website Name and Coins */}
        <Box display="flex" alignItems="center">
          <Typography variant="h6" sx={{ mr: 2, fontSize: '2rem', cursor: "pointer" }} onClick={() => navigate("/games")}>
            Highg-!
          </Typography>
          {
            userInfo ? (<> <div style={{ display: "flex", alignItems: "center", width: "130px", gap: "4px", border: "1px solid white", padding: "2px", borderRadius: "8px" }}>
              <img src="/images/coins.png" alt="coins" style={{ width: "22px", height: "22px" }} />
              <span style={{ fontSize: "22px", color: "white" }}>{userInfo?.totalCoins}</span>
            </div></>) : <div></div>
          }

        </Box>

        {/* Center Section: Main Navbar */}
        <Box display="flex" alignItems="center">
          {userInfo ? (
            <>
              <Typography
                variant="body1"
                sx={{ fontSize: "1.5rem", color: "white", fontWeight: "bold" }}
              >
                {userInfo?.name}
              </Typography>
              <Button
                color="inherit"
                onClick={() => { navigate("/profile"); setActiveButton("profile"); }}
                sx={{ fontSize: '1.5rem' }}
                style={activeButton === "profile" ? activeTextStyle : defaultTextStyle}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                onClick={() => { navigate("/games"); setActiveButton("games"); }}
                sx={{ fontSize: '1.5rem' }}
                style={activeButton === "games" ? activeTextStyle : defaultTextStyle}
              >
                Games
              </Button>
              <Button
                color="inherit"
                onClick={() => { navigate("/products"); setActiveButton("products"); }}
                sx={{ fontSize: '1.5rem' }}
                style={activeButton === "products" ? activeTextStyle : defaultTextStyle}
              >
                Products
              </Button>
              <Button
                color="inherit"
                onClick={logoutHandler}
                sx={{ fontSize: '1.5rem' }}
                style={activeButton === "logout" ? activeTextStyle : defaultTextStyle}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
                <Button
                  color="inherit"
                  onClick={loginHandler}
                  style={{
                    ...(activeButton === "login" ? activeTextStyle : defaultTextStyle),
                    fontSize: "28px", // Font size for Sign In button
                  }}              >
                  Sign In
                </Button>
                <Button
                  color="inherit"
                  onClick={signupHandler}
                  style={{
                    ...(activeButton === "signup" ? activeTextStyle : defaultTextStyle),
                    fontSize: "28px", // Font size for Sign Up button
                  }}                >
                  Sign Up
              </Button>
            </>
          )}
        </Box>

        {/* Right Section: Leaderboard */}
        <Box display="flex" alignItems="center">
          <Button
            color="inherit"
            onClick={() => { navigate("/leaderboard"); setActiveButton("leaderboard"); }}
            style={activeButton === "leaderboard" ? activeTextStyle : defaultTextStyle}
            sx={{ fontSize: "3rem", fontWeight: "bold" }}
          >
            Leaderboard
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

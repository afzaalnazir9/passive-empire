import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [logoutApiCall] = useLogoutMutation();
  const [activeButton, setActiveButton] = useState("");

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const loginHandler = () => {
    navigate("/login");
  };

  const signupHandler = () => {
    navigate("/register");
  };

  useEffect(() => {
    if (location.pathname === "/games") {
      setActiveButton("games");
    } else if (location.pathname === "/profile") {
      setActiveButton("profile");
    } else if (location.pathname === "/products") {
      setActiveButton("products");
    } else if (location.pathname === "/leaderboard") {
      setActiveButton("leaderboard");
    } else if (userInfo) {
      setActiveButton("games");
    }
  }, [location.pathname, userInfo]);

  const activeTextStyle = {
    color: "#FAD700",
  };

  const defaultTextStyle = {
    color: "white",
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" sx={{ mr: 2, fontSize: '2rem', cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate("/games")}>
            Highg-!
          </Typography>
          {
            userInfo ? (<> <div style={{ display: "flex", alignItems: "center", width: "130px", gap: "4px", border: "1px solid white", padding: "2px", borderRadius: "8px" }}>
              <img src="/images/coins.png" alt="coins" style={{ width: "22px", height: "22px" }} />
              <span style={{ fontSize: "22px", color: "white" }}>{userInfo?.totalCoins}</span>
            </div></>) : <div></div>
          }

        </Box>

        <Box display="flex" alignItems="center">
          {userInfo ? (
            <>
              <Typography
                onClick={() => { navigate("/profile"); setActiveButton("profile"); }}
                variant="body1"
                sx={{ fontSize: "2rem", color: "white", fontWeight: "bold", cursor: "pointer" }}
                style={activeButton === "profile" ? activeTextStyle : defaultTextStyle}
              >
                {userInfo?.name}
              </Typography>
              {/* <Button
                color="inherit"
                onClick={() => { navigate("/profile"); setActiveButton("profile"); }}
                sx={{ fontSize: '1.5rem', fontWeight: "bold" }}
                style={activeButton === "profile" ? activeTextStyle : defaultTextStyle}
              >
                Profile
              </Button> */}
              <Button
                color="inherit"
                onClick={() => { navigate("/games"); setActiveButton("games"); }}
                sx={{ fontSize: '1.5rem', fontWeight: "bold" }}
                style={activeButton === "games" ? activeTextStyle : defaultTextStyle}
              >
                Games
              </Button>
              <Button
                color="inherit"
                onClick={() => { navigate("/products"); setActiveButton("products"); }}
                sx={{ fontSize: '1.5rem', fontWeight: "bold" }}
                style={activeButton === "products" ? activeTextStyle : defaultTextStyle}
              >
                Store
              </Button>
              <Button
                color="inherit"
                onClick={logoutHandler}
                sx={{ fontSize: '1.5rem', fontWeight: "bold" }}
                style={activeButton === "logout" ? activeTextStyle : defaultTextStyle}
              >
                Logout
              </Button>
            </>
          ) : (
            <div>
              <Button
                color="inherit"
                onClick={loginHandler}
                style={{
                  ...(activeButton === "login" ? activeTextStyle : defaultTextStyle),
                  fontSize: "28px",
                  fontWeight: "bold",
                }}              >
                Sign In
              </Button>
              <Button
                color="inherit"
                onClick={signupHandler}
                style={{
                  ...(activeButton === "signup" ? activeTextStyle : defaultTextStyle),
                  fontSize: "28px",
                  fontWeight: "bold",
                }}                >
                Sign Up
              </Button>
            </div>
          )}
        </Box>

        {
          userInfo ? (<Box display="flex" alignItems="center">
            <Button
              color="inherit"
              onClick={() => { navigate("/leaderboard"); setActiveButton("leaderboard"); }}
              style={activeButton === "leaderboard" ? activeTextStyle : defaultTextStyle}
              sx={{ fontSize: "2.5rem", fontWeight: "bold" }}
            >
              Leaderboard
            </Button>
          </Box>) : <div></div>
        }


      </Toolbar>
    </AppBar>
  );
};

export default Header;

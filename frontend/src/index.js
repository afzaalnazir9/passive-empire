import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store.js";
import { Provider } from "react-redux";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import GamesList from "./screens/GamesList.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./screens/Home.jsx";
import Payment from "./screens/Subscription.jsx";
import Notfound from "./NotFound.jsx";
import LeaderBoard from "./screens/LeaderBoard.jsx";
import EmailVerification from "./screens/EmailVerification.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<Home />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/games" element={<GamesList />} />
      <Route path="/verify-email" element={<EmailVerification />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/store" element={<Payment />} />
        <Route path="*" element={<Notfound />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

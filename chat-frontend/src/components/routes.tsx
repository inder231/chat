import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PrivateRoutes from "./PrivateRoute";
import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import LoadingSpinner from "./LoadingSpinner";
import Home from "../pages/Home";

const Allroutes = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useContext(AccountContext) as any;
  return user.loggedIn === null ? (
    <LoadingSpinner />
  ) : (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default Allroutes;

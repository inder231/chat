import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AccountContext } from "../context/AccountContext";

const useAuth = ()=>{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {user} = useContext(AccountContext) as any;
    return user && user.loggedIn;
}

const PrivateRoutes = ()=>{
    const isAuth = useAuth();
    return isAuth ? <Outlet/> : <Navigate to="/login" />
}

export default PrivateRoutes;
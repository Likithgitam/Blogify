import { Navigate, Outlet } from "react-router";
import { useContext } from "react";
import UserContext from "../../context/UserContext";

function ProtectedRoutes() {
  const { user } = useContext(UserContext);
  console.log(user);
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;

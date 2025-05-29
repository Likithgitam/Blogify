import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import Cookies from "js-cookie";

import ProtectedRoutes from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import AddBlog from "./components/AddBlog";
import UserContext from "./context/UserContext";

import "./App.css";

function App() {
  const [user, setUser] = useState();
  const jwtToken = Cookies.get("jwtToken");

  const getUser = async () => {
    try {
      const response = await fetch("/api/protected", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + jwtToken,
          "Content-Type": "application/json",
        },
      });

      const { user } = await response.json();

      if (response.ok) {
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.log(e);
      setUser(null);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Navbar />
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/add-blog" element={<AddBlog />} />
          </Route>
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;

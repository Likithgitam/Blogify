import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import Cookies from "js-cookie";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer } from "react-toastify";

import ProtectedRoutes from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import AddBlog from "./components/AddBlog";
import EditBlog from "./components/EditBlog";
import FailureView from "./components/FailureView";
import UserContext from "./context/UserContext";
import BlogItemDetails from "./components/BlogItemDetails";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS",
  };

  const [user, setUser] = useState({ _id: "", username: "", email: "" });
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const jwtToken = Cookies.get("jwtToken");

  const getUser = async () => {
    setApiStatus(apiStatusConstants.inProgress);
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
      setApiStatus(apiStatusConstants.success);
    } catch (e) {
      console.log(e);
      setApiStatus(apiStatusConstants.failure);
      setUser(null);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const renderSuccessView = () => {
    return (
      <>
        <UserContext.Provider value={{ user, setUser }}>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/blogs/:blogId" element={<BlogItemDetails />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/add-blog" element={<AddBlog />} />
              <Route path="/blogs/edit/:blogId" element={<EditBlog />} />
            </Route>
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
        </UserContext.Provider>
      </>
    );
  };

  const renderFailureView = () => {
    return (
      <div
        style={{ height: "100vh" }}
        className="container d-flex flex-row justify-content-center"
      >
        <FailureView
          onRetry={getUser}
          message="We are having some trouble fetching the data. Please try again."
        />
      </div>
    );
  };

  const renderLoadingView = () => {
    return (
      <div
        style={{ height: "100vh" }}
        className="container d-flex flex-row justify-content-center align-items-center"
      >
        <ClipLoader />
      </div>
    );
  };

  switch (apiStatus) {
    case apiStatusConstants.success:
      return renderSuccessView();
    case apiStatusConstants.failure:
      return renderFailureView();
    case apiStatusConstants.inProgress:
      return renderLoadingView();
    default:
      return null;
  }
}

export default App;

import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import Cookies from "js-cookie";

import UserContext from "../../context/UserContext";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClickLogout = () => {
    navigate("/");
    Cookies.remove("jwtToken");
    setUser(null);
  };

  const renderIfLoggedIn = () => {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {user.username}
        </a>
        <ul className="dropdown-menu">
          <li>
            <button className="dropdown-item" onClick={handleClickLogout}>
              Logout
            </button>
          </li>
        </ul>
      </li>
    );
  };

  const renderIfNotLoggedIn = () => {
    return (
      <li className="nav-item">
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </li>
    );
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary bg-dark"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Blogify
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link active" aria-current="page">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/add-blog" className="nav-link">
                Add Blog
              </Link>
            </li>
            {user ? renderIfLoggedIn() : renderIfNotLoggedIn()}
            <li className="nav-item">
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { useNavigate } from "react-router";
import { useState } from "react";

const API_BASE_URL = import.meta.env.API_BASE_URL;

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrMsg("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const { message } = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErrMsg("*" + message);
      }
    } catch (e) {
      console.log("Error: ", e);
      setErrMsg("*Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container pt-5 pb-5">
      <form onSubmit={handleFormSubmit}>
        <div className="d-flex flex-row justify-content-between">
          <div className="mb-3 w-50 p-1">
            <label htmlFor="firstName" className="form-label">
              First Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 w-50 p-1">
            <label htmlFor="lastName" className="form-label">
              Last Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Sign Up"}
        </button>
      </form>

      {errMsg && <p className="text-danger mt-3">{errMsg}</p>}
    </div>
  );
}

export default SignUp;

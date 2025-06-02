import { useState, useRef, useMemo, useEffect, useContext } from "react";
import JoditEditor from "jodit-react";
import { useNavigate, useParams } from "react-router";
import Cookies from "js-cookie";

import ClipLoader from "react-spinners/ClipLoader";
import FailureView from "../FailureView";
import UserContext from "../../context/UserContext";

const API_BASE_URL = import.meta.env.API_BASE_URL;

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

function AddBlog() {
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Start typings...",
      height: 400,
      width: "100%",
    }),
    []
  );

  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    coverImage: null,
    coverImageUrl: "",
    title: "",
    content: "",
  });
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const { blogId } = useParams();

  const getBlogDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}`, {
        method: "GET",
      });

      if (!response.ok) {
        setApiStatus(apiStatusConstants.failure);
        return;
      }

      const { blogDetails } = await response.json();

      if (blogDetails.author._id !== user._id) {
        setApiStatus(apiStatusConstants.failure);
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        coverImageUrl: blogDetails.coverImageUrl,
        title: blogDetails.title,
        content: blogDetails.content,
      }));
      setApiStatus(apiStatusConstants.success);
    } catch (e) {
      console.error("Fetch blog details error:", e);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getBlogDetails();
  }, []);

  // when Form is submitted
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmitBlog = async (e) => {
    e.preventDefault();

    const stripHtml = (html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || "";
    };

    const { title, coverImage, content } = formData;
    if (!content || !stripHtml(content).trim()) {
      setErrMsg("*Content Should not be empty");
      return;
    }

    const fd = new FormData();
    fd.append("coverImage", coverImage);
    fd.append("title", title);
    fd.append("content", content);

    setLoading(true);
    setErrMsg("");

    try {
      const response = await fetch(`/api/blogs/edit/${blogId}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + Cookies.get("jwtToken"),
        },
        body: fd,
      });

      const { message } = await response.json();

      if (!response.ok) {
        setErrMsg(message);
      } else {
        setErrMsg("");
        navigate(`/blogs/${blogId}`, { replace: true });
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  };

  const renderFailureView = () => (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "90vh" }}
    >
      <FailureView
        onRetry={getBlogDetails}
        message="We cannot seem to find the page you are looking for."
      />
    </div>
  );
  const renderLoadingView = () => (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <ClipLoader size={50} color="#007bff" />
    </div>
  );

  const renderSuccessView = () => {
    return (
      <div
        style={{ minHeight: "90vh" }}
        className="container d-flex flex-column justify-content-center pt-3 pb-3"
      >
        <form onSubmit={handleSubmitBlog} encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="coverImage" className="form-label">
              Cover Image:
            </label>
            <div className="d-flex flex-row">
              {formData.coverImage ? (
                <img
                  src={URL.createObjectURL(formData.coverImage)}
                  alt="New Cover"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    borderRadius: "8px",
                    marginRight: "15px",
                  }}
                />
              ) : (
                <img
                  src={formData.coverImageUrl}
                  alt="Current Cover"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    borderRadius: "8px",
                    marginRight: "15px",
                  }}
                />
              )}

              <input
                className="form-control align-self-end"
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={(e) => {
                  setFormData({ ...formData, coverImage: e.target.files[0] });
                }}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title:
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
              }}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description:</label>
            <JoditEditor
              ref={editor}
              value={formData.content}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onChange={(newContent) =>
                setFormData({ ...formData, content: newContent })
              }
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
        {errMsg && <p className="text-danger mt-3">{errMsg}</p>}
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

export default AddBlog;

import HTMLReactParser from "html-react-parser";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import UserContext from "../../context/UserContext";
import FailureView from "../FailureView";

const API_BASE_URL = import.meta.env.API_BASE_URL;

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

function BlogItemDetails() {
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    coverImageUrl: "",
    content: "",
    author: {},
    createdAt: "",
    _id: "",
  });

  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);

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
      setBlogDetails(blogDetails);
      setApiStatus(apiStatusConstants.success);
    } catch (e) {
      console.error("Fetch blog details error:", e);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getBlogDetails();
  }, []);

  const handleDeleteBlog = async () => {
    const result = await Swal.fire({
      title: `Delete "${blogDetails.title}"?`,
      text: "Are you sure you want to delete this blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "text-dark",
        title: "text-dark",
        htmlContainer: "swal2-custom-text",
        confirmButton: "btn btn-danger me-2",
        cancelButton: "btn btn-secondary",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/blogs/${blogDetails._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Cookies.get("jwtToken"),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Error: ${data.message}`, { position: "bottom-left" });
        return;
      }

      toast.success("Blog deleted successfully!", { position: "bottom-left" });
      navigate("/"); // redirect to blog list after deletion
    } catch (error) {
      toast.error(`Error: ${error.message}`, { position: "bottom-left" });
      console.error("Error deleting blog:", error);
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
    const { title, content, coverImageUrl, author, createdAt, _id } =
      blogDetails;
    const isAuthor = currentUser && currentUser._id === author._id;

    const formattedDate = new Date(createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <div className="container pt-5 pb-5">
        <div className="card shadow-sm p-4">
          <img
            src={coverImageUrl}
            alt="cover"
            className="img-fluid rounded mb-4"
            style={{ maxHeight: "600px", objectFit: "cover", width: "100%" }}
          />
          <h1 className="mt-3">{title}</h1>
          <p className="text-muted">
            <small>
              Posted by: {author.username} | Published on: {formattedDate}
            </small>
          </p>

          {/* Buttons for author */}
          {isAuthor && (
            <div className="mb-3">
              <button
                className="btn btn-outline-secondary btn-sm me-2"
                onClick={() => navigate(`/blogs/edit/${_id}`)}
              >
                Edit
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleDeleteBlog}
              >
                Delete
              </button>
            </div>
          )}

          <hr />
          <div className="mb-4 blog-content">{HTMLReactParser(content)}</div>
        </div>
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

export default BlogItemDetails;

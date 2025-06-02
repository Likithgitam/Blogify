import HTMLReactParser from "html-react-parser";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ClipLoader from "react-spinners/ClipLoader"; // ensure this is installed
import FailureView from "../FailureView"; // adjust the import path as needed

function BlogItemDetails() {
  const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS",
  };

  const [blogDetails, setBlogDetails] = useState({
    title: "",
    coverImage: "",
    content: "",
    author: {},
  });

  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const { blogId } = useParams();

  const getBlogDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const response = await fetch(`/api/blogs/${blogId}`, { method: "GET" });

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
    const { title, content, coverImageUrl, author } = blogDetails;

    return (
      <div className="container pt-5 pb-5">
        <div className="card shadow-sm p-4">
          <img
            src={coverImageUrl}
            alt="..."
            className="img-fluid rounded mb-4"
            style={{ maxHeight: "600px", objectFit: "cover", width: "100%" }}
          />
          <h1 className="mt-3">{title}</h1>
          <hr />
          <div className="mb-4 blog-content">{HTMLReactParser(content)}</div>
          <p className="text-muted text-end">
            <small>Posted by: {author.username}</small>
          </p>
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

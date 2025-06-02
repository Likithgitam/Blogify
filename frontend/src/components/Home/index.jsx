import { useEffect, useState } from "react";
import BlogItem from "../BlogItem";

const Home = () => {
  const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS",
  };

  const [blogs, setBlogs] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const getBlogs = async () => {
    setApiStatus(apiStatusConstants.initial);

    try {
      const response = await fetch("/api/blogs", { method: "GET" });

      if (!response.ok) {
        setApiStatus(apiStatusConstants.failure);
        return;
      }

      const { blogs } = await response.json();
      setBlogs(blogs);
      setApiStatus(apiStatusConstants.success);
    } catch (e) {
      console.log(e);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const renderFailureView = () => (
    <div
      style={{ height: "100vh" }}
      className="container d-flex justify-content-center align-items-center"
    >
      <FailureView onRetry={getBlogs} />
    </div>
  );

  const renderLoadingView = () => (
    <div
      style={{ height: "100vh" }}
      className="container d-flex justify-content-center align-items-center"
    >
      <ClipLoader />
    </div>
  );

  const renderSuccessView = () => {
    if (blogs.length === 0) {
      return (
        <div
          style={{ height: "90vh", textAlign: "center" }}
          className="container d-flex flex-column justify-content-center align-items-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No blogs"
            style={{ width: "150px", marginBottom: "20px" }}
          />
          <h3 className="mb-3">No Blogs Found</h3>
          <p className="text-muted mb-4">
            Looks like there aren't any blog posts right now.
          </p>
          <div className="d-flex gap-3">
            <button className="btn btn-primary" onClick={getBlogs}>
              Retry
            </button>
            <a href="/add-blog" className="btn btn-outline-secondary">
              Add Blog
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="container py-4">
        <div className="row">
          {blogs.map((eachBlog) => (
            <div
              key={eachBlog._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4"
            >
              <BlogItem blogDetails={eachBlog} onDeleteSuccess={getBlogs} />
            </div>
          ))}
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
};

export default Home;

import { useContext } from "react";
import { useNavigate } from "react-router";

import UserContext from "../../context/UserContext";

function BlogItem({ blogDetails }) {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const { _id, coverImageUrl, title, author } = blogDetails;

  const isAuthor = currentUser && currentUser._id === author._id;

  return (
    <div
      className="card shadow-sm h-100 d-flex flex-column"
      style={{ width: "100%", maxWidth: "18rem" }}
    >
      <img
        src={coverImageUrl}
        className="card-img-top"
        alt="..."
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <div className="mb-3">
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">
            <small>Posted by: {author.username}</small>
          </p>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-auto">
          <button
            onClick={() => navigate(`/blogs/${_id}`)}
            className="btn btn-primary btn-sm"
          >
            View
          </button>
          {isAuthor && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                navigate(`/blogs/edit/${_id}`);
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogItem;

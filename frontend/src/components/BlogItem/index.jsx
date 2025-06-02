import { useContext } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

import UserContext from "../../context/UserContext";

const API_BASE_URL = import.meta.env.API_BASE_URL;

function BlogItem(props) {
  const { blogDetails, onDeleteSuccess } = props;

  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const { _id, coverImageUrl, title, author, createdAt } = blogDetails;

  const isAuthor = currentUser && currentUser._id === author._id;

  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "";

  const handleDeleteBlog = async () => {
    const result = await Swal.fire({
      title: `Delete "${title}"?`,
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
      const response = await fetch(`${API_BASE_URL}/api/blogs/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cookies.get("jwtToken"),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Error: ${data.message}`, { position: "bottom-left" });
        return;
      }

      toast.success("Blog deleted successfully!", { position: "bottom-left" });
      onDeleteSuccess();
    } catch (error) {
      toast.error(`Error: ${error.message}`, { position: "bottom-left" });
      console.error("Error deleting blog:", error);
    }
  };

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
            <small>
              Posted by: {author.username} • {timeAgo}
            </small>
          </p>
        </div>

        <div className="d-flex justify-content-between gap-2 mt-auto">
          <button
            onClick={() => navigate(`/blogs/${_id}`)}
            className="btn btn-primary btn-sm"
          >
            View
          </button>
          {isAuthor && (
            <div>
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
        </div>
      </div>
    </div>
  );
}

export default BlogItem;

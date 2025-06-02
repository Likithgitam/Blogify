import { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.API_BASE_URL;

function AddBlog() {
  const editor = useRef(null);

  const [formData, setFormData] = useState({
    coverImage: null,
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Start typings...",
      height: 400,
      width: "100%",
    }),
    []
  );

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
      const response = await fetch(`${API_BASE_URL}/api/blogs`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + Cookies.get("jwtToken"),
        },
        body: fd,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrMsg(data.message);
      } else {
        navigate(`/blogs/${data.blogId}`, { replace: true });
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  };

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
            {formData.coverImage && (
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
            )}
            <input
              className="form-control align-self-end"
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={(e) => {
                setFormData({ ...formData, coverImage: e.target.files[0] });
              }}
              required
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
            onBlur={(newContent) =>
              setFormData({ ...formData, content: newContent })
            }
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {errMsg && <p className="text-danger mt-3">{errMsg}</p>}
    </div>
  );
}

export default AddBlog;

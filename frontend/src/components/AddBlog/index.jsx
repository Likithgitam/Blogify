import { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

function AddBlog() {
  const editor = useRef(null);

  // const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    coverImage: null,
    title: "",
    content: "",
  });

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Start typings...",
      height: 400,
      width: "100%",
    }),
    []
  );

  const handleSubmitBlog = (e) => {
    e.preventDefault();
  };

  return (
    <div
      style={{ minHeight: "85vh" }}
      className="container d-flex flex-column justify-content-center"
    >
      <form onSubmit={handleSubmitBlog}>
        <div className="mb-3">
          <label for="coverImage" className="form-label">
            Cover Image:
          </label>
          <input className="form-control" type="file" id="coverImage" />
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
      </form>
    </div>
  );
}

export default AddBlog;

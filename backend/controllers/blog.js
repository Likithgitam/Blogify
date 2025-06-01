const Blog = require("../models/blog");

async function handleCreateNewBlog(req, res) {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Invalid File." });
  }

  try {
    await Blog.create({
      coverImage: req.file.path,
      title,
      content,
      author: req.user._id,
    });

    return res.status(200).json({
      message: "Blog Created Successfully",
    });
  } catch (e) {
    console.error("Error creating Blog:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = { handleCreateNewBlog };

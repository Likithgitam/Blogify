const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const mongoose = require("mongoose");
const Blog = require("../models/blog");

cloudinary.config({
  cloud_name: "dtz9sclra",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function handleCreateNewBlog(req, res) {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing." });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required.",
    });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Cover image file is required." });
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(req.file.path);
    fs.unlink(req.file.path, (error) => {
      if (error) {
        console.log(error);
      }
    });

    const result = await Blog.create({
      title,
      content,
      coverImageUrl: uploadResponse.url,
      author: req.user._id,
    });

    return res.status(200).json({
      message: "Blog created successfully.",
      blogId: result._id,
    });
  } catch (e) {
    console.log("Error Creating Blog:", e);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function handleGetAllBlogs(req, res) {
  try {
    const blogs = await Blog.find(
      {},
      { title: 1, author: 1, coverImageUrl: 1, createdAt: 1 }
    ).populate("author", "username");
    return res
      .status(200)
      .json({ message: "Blogs fetched successfully.", blogs });
  } catch (e) {
    console.log("Error Retrieving Blogs:", e);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function handleGetSpecificBlog(req, res) {
  const { blogId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid blog ID." });
  }

  try {
    const blogDetails = await Blog.findById(blogId).populate(
      "author",
      "username"
    );

    if (!blogDetails) {
      return res.status(404).json({ message: "Blog not found." });
    }

    return res.status(200).json({
      message: "Blog details fetched successfully.",
      blogDetails,
    });
  } catch (e) {
    console.log("Error Retrieving Blog Details:", e);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function handleUpdateSpecificBlog(req, res) {
  const { blogId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid blog ID." });
  }

  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing." });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required.",
    });
  }

  const currentUser = req.user._id;

  try {
    const blogDetails = await Blog.findById(blogId);

    if (!blogDetails) {
      return res.status(404).json({ message: "Blog not found." });
    }

    if (blogDetails.author.toString() !== currentUser) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this blog." });
    }

    let updatedData = {
      title,
      content,
    };

    if (req.file) {
      // Delete old image from Cloudinary
      const oldImageUrl = blogDetails.coverImageUrl;
      const parts = oldImageUrl.split("/");
      const filename = parts[parts.length - 1];
      const publicId = filename.split(".")[0];

      await cloudinary.uploader.destroy(publicId);

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(req.file.path);

      // Delete temp file
      fs.unlink(req.file.path, (error) => {
        if (error) {
          console.log("Error deleting temp file:", error);
        }
      });

      updatedData.coverImageUrl = uploadResult.url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, {
      new: true,
    });

    res.status(200).json({
      message: "Blog updated successfully.",
      blog: updatedBlog,
    });
  } catch (error) {
    console.log("Update Blog Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function handleDeleteSpecificBlog(req, res) {
  const { blogId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid blog ID." });
  }

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    const currentUser = req.user._id;
    if (currentUser !== blog.author.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this blog." });
    }

    // Extract public_id from Cloudinary URL
    const imageUrl = blog.coverImageUrl;
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1];
    const publicId = filename.split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({ message: "Blog and image deleted successfully." });
  } catch (error) {
    console.log("Delete blog error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  handleCreateNewBlog,
  handleGetAllBlogs,
  handleGetSpecificBlog,
  handleUpdateSpecificBlog,
  handleDeleteSpecificBlog,
};

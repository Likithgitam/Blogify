const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

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
      message: "All fields are required.",
    });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Invalid File." });
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
      message: "Blog Created Successfully",
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
      { title: 1, author: 1, coverImageUrl: 1 }
    ).populate("author", "username");
    return res
      .status(200)
      .json({ message: "Blogs Fetched Successfully", blogs });
  } catch (e) {
    console.log("Error Retrieving Blogs:", e);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function handleGetSpecificBlog(req, res) {
  const { blogId } = req.params;
  try {
    const blogDetails = await Blog.findById(blogId).populate(
      "author",
      "username"
    );
    return res
      .status(200)
      .json({ message: "Blog Details Fetched Successfully", blogDetails });
  } catch (e) {
    console.log("Error Retrieving Blog Details:", e);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function handleUpdateSpecificBlog(req, res) {
  const { blogId } = req.params;

  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing." });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Invalid File." });
  }

  const currentUser = req.user._id;

  try {
    const blogDetails = await Blog.findById(blogId);

    if (!blogDetails) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blogDetails.author.toString() !== currentUser) {
      return res.status(403).json({ message: "Not Authorised" });
    }

    // Handle image update
    let coverImageUrl = blogDetails.coverImageUrl;

    if (req.file) {
      // If a new image was uploaded, upload to Cloudinary or wherever
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      fs.unlink(req.file.path, (error) => {
        if (error) {
          console.log(error);
        }
      });

      coverImageUrl = uploadResult.url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        content,
        coverImageUrl,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  handleCreateNewBlog,
  handleGetAllBlogs,
  handleGetSpecificBlog,
  handleUpdateSpecificBlog,
};

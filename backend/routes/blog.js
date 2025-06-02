const express = require("express");

const { upload } = require("../utils/fileUpload");
const { authMiddleware } = require("../middlewares/auth");

const {
  handleCreateNewBlog,
  handleGetAllBlogs,
  handleGetSpecificBlog,
  handleUpdateSpecificBlog,
} = require("../controllers/blog");
const Blog = require("../models/blog");

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, upload.single("coverImage"), handleCreateNewBlog)
  .get(handleGetAllBlogs);

router.get("/:blogId", handleGetSpecificBlog);

router.put(
  "/edit/:blogId",
  authMiddleware,
  upload.single("coverImage"),
  handleUpdateSpecificBlog
);

module.exports = router;

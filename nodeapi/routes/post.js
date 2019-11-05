const express = require("express");
const {
  getPosts,
  createPost,
  postsByUser,
  postById,
  isPoster,
  deletePost,
  updatePost,
  photo,
  singlePost
} = require("../controllers/post");
const { createPostValidator } = require("../validator/index");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const router = express.Router();

router.get("/posts", getPosts);
router.post(
  "/post/new/:userId",
  requireSignin,
  createPost,
  createPostValidator
);
router.get("/posts/by/:userId", requireSignin, postsByUser);
router.get("/post/photo/:postId", photo);
router.get("/post/:postId", singlePost);

router.delete("/post/:postId", requireSignin, isPoster, deletePost);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.param("userId", userById); //if route has :userId execute userbyId

router.param("postId", postById); ////if route has :postId execute postbyId

module.exports = router;

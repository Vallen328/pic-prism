const router = require('express').Router();
const {verifyToken} = require('../middlewares/verifyToken');
const { createPost, getAllPosts, getMyPosts } = require('../controllers/postController');

router.post("/post/create", verifyToken, createPost);
router.get("/post/all", getAllPosts);
router.get("/post/myPosts", verifyToken, getMyPosts);

module.exports = router;
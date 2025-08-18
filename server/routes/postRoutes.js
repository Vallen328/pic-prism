const router = require('express').Router();
const {verifyToken} = require('../middlewares/verifyToken');
const { createPost, getAllPosts, getMyPosts, deletePost, searchPosts, addToFavourites, removeFromFavourites, getFavourites } = require('../controllers/postController');

router.post("/post/create", verifyToken, createPost);
router.get("/post/all", getAllPosts);
router.get("/post/myPosts", verifyToken, getMyPosts);
router.delete("/post/delete/:id", verifyToken, deletePost);
router.get("/post/search", searchPosts);
router.post("/post/addToFavourites/:postId", verifyToken, addToFavourites);
router.post("/post/removeFromFavourites/:postId", verifyToken, removeFromFavourites);
router.get("/post/favourites", verifyToken, getFavourites);

module.exports = router;
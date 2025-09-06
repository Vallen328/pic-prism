const Post = require('../models/Post');
const User = require('../models/User');

const createPost  =async(req, res) => {
    const authorId = req.id;
    const authorAccountType = req.accountType;

    if(authorAccountType == "buyer"){
        return res.status(403).json({success: false, message: "Forbidden, only sellers can post"});
    }

    const { title, author, price, image, publicId } = req.body;

    try{
        const post = new Post({
            title,
            author,
            price,
            image,
            publicId,
            authorId
        });
        await post.save();

        await User.findByIdAndUpdate(authorId, {
            $push: { uploads: post._id },
        });

        return res.status(201).json({success: true, message: "Post created successfully", post});
    }catch(error){
        return res.status(500).json({success: false, message: error.message});
    }
};

// controllers/postController.js (or wherever getAllPosts lives)
const getAllPosts = async (req, res) => {
  try {
    // only return posts that are not soft-deleted
    const posts = await Post.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 }) // optional: newest first
      .populate("authorId", "username _id"); // adjust populate fields to your schema

    if (!posts || posts.length === 0) {
      return res.status(200).json({ success: true, data: [] }); // return empty array rather than 404
    }

    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const getMyPosts = async(req, res) => {
    const authorId = req.id;
    const authorAccountType = req.accountType;
    try {
        if(authorAccountType === "buyer") {
            const { purchased } = await User.findById(authorId).populate('purchased');
            console.log(purchased);
            if(!purchased) return res.status(404).json({success: false, message: "No posts found"});
            return res.status(200).json({success: true, data: purchased});
        }else{
            const { uploads } = await User.findById(authorId).populate('uploads');
            if(!uploads) return res.status(404).json({success: false, message: "No posts found"});
            return res.status(200).json({success: true, data: uploads});
        }
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error"});
    }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Remove post reference from user's uploads
    const authorId = post.authorId || post.author; // adjust if your schema uses authorId
    await User.findByIdAndUpdate(authorId, {
      $pull: { uploads: id },
    });

    // Soft-delete the post so it won't show in public lists but is preserved
    post.isDeleted = true;
    await post.save();

    return res.status(200).json({ success: true, message: "Post deleted (soft) successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update a post (seller edits metadata like title, price, image, publicId etc.)
const updatePost = async (req, res) => {
  const { id } = req.params;
  const updates = req.body; // expect { title, price, image, publicId, ... }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Optionally: check that req.id (authenticated user) is the author
    if (String(post.authorId) !== String(req.id)) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this post" });
    }

    // apply updates (whitelist fields)
    const allowed = ["title", "price", "image"]; // extend if needed
    allowed.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        post[field] = updates[field];
      }
    });

    // save and return updated doc
    await post.save();

    return res.status(200).json({ success: true, data: post, message: "Post updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const searchPosts = async(req, res) => {
    const { search } = req.query;
    try{
        const posts = await Post.find({
            title : {$regex: search, $options: "i"}});     //options => use for matching lowercase and uppercase
            if(posts.length == 0) {
                return res.status(404).json({success: false, message: "No post found"});
            }
            return res.status(200).json({success: true, data: posts});
    }catch(error){
        return res.status(500).json({success: false, message: error.message});
    }
};

// const addToFavourites = async(req, res) => {
//     const {authorId} = req.id;
//     const {postId} = req.params;    
//     try{
//         const user = await User.findByIdAndUpdate(authorId, {
//             $push: {favourites: postId},
//         });
//         if(!user) return res.status(404).json({success: false, message: "User not found"});
//         return res.status(200).json({success: true, message: "Post added to favourites"});
//     }catch(error){
//         return res.status(500).json({success: false, message: error.message});
//     }
// };
// const removeFromFavourites = async(req, res) => {
//     const {authorId} = req.id;
//     const {postId} = req.params;    
//     try{
//         const user = await User.findByIdAndUpdate(authorId, {
//             $pull: {favourites: postId},
//         });
//         if(!user) return res.status(404).json({success: false, message: "User not found"});
//         return res.status(200).json({success: true, message: "Post removed from favourites"});
//     }catch(error){
//         return res.status(500).json({success: false, message: error.message});
//     }
// };

// const getFavourites = async(req, res) => {
//     const authorId = req.id;
//     try{
//         const {favourites} = await User.findById(authorId).populate("favourites");
//         if(!favourites) return res.status(404).json({success: false, message: "No favourites added"});
//         return res.status(200).json({success: true, data: favourites});
//     }catch(error){
//         return res.status(500).json({success: false, message: error.message});
//     }
// };
// controllers/postController.js (or wherever these handlers live)

const addToFavourites = async (req, res) => {
  const authorId = req.id;            // <-- use req.id directly
  const { postId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      authorId,
      { $addToSet: { favourites: postId } }, // addToSet avoids duplicates
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, message: "Post added to favourites", data: user.favourites });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromFavourites = async (req, res) => {
  const authorId = req.id;
  const { postId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      authorId,
      { $pull: { favourites: postId } },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, message: "Post removed from favourites", data: user.favourites });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getFavourites = async (req, res) => {
  const authorId = req.id;
  try {
    const user = await User.findById(authorId).populate("favourites");
    const favourites = user?.favourites || [];

    return res.status(200).json({ success: true, data: favourites });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addToFavourites, removeFromFavourites, getFavourites };

const getPostsByDateRange = async(req, res) => {
    const authorId = req.id;
    const authorAccountType = req.accountType;
    let data;

    try{
        if(authorAccountType == "buyer"){
            const {purchased} = await User.findById(authorId).populate('purchased');
            data = purchased;
        }else{
            const {uploads} = await User.findById(authorId).populate('uploads');
            data = uploads;
        }
        if(!data) return res.status(404).json({success: false, message: "No posts found"});

        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); 
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

        const postsThisYear = data.filter((post) => new Date(post.createdAt) >= startOfYear);
        const postsThisMonth = data.filter((post) => new Date(post.createdAt) >= startOfMonth);
        const postsThisWeek = data.filter((post) => new Date(post.createdAt) >= startOfWeek);

        return res.status(200).json({success: true, data: {tillNow: data, thisYear: postsThisYear, thisMonth: postsThisMonth, thisWeek: postsThisWeek,},
        });
    }catch(error){
        return res.status(500).json({success: false, message: error.message});
    }
}


module.exports = {createPost, getAllPosts, getMyPosts, deletePost, updatePost, searchPosts, addToFavourites, removeFromFavourites, getFavourites, getPostsByDateRange};

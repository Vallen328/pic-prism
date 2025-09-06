import React, { useEffect, useState } from "react";
import DashboardHeader from "../DashboardHeader";
import ImageAdd from "../ImageAdd";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../../../store/slices/authSlice";
import { setMyPosts, deletePost } from "../../../store/slices/postSlice";
import axios from "axios";
import ImageCard from "../ImageCard";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import EditPostModal from "../EditPostModal";

const PhotoManagement = () => {
  const posts = useSelector((state) => state.posts.myPosts);
  const dispatch = useDispatch();
  const [editingPost, setEditingPost] = useState(null);


  const getMyPosts = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/post/myPosts", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      const data = res.data?.data ?? res.data;
      console.log("my posts:", data);
      dispatch(setMyPosts(data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch posts");
      dispatch(logout());
    }
  };

  const handleOpenEdit = (post) => {
  setEditingPost(post);
  };
  const handleCloseEdit = () => setEditingPost(null);


  const deletePostById = async (id) => {
    return axios.delete(`${import.meta.env.VITE_API_URL}/post/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await deletePostById(id);
      toast.success(res.data?.message || "Post deleted");

      // update redux so both myPosts and allPosts are updated
      dispatch(deletePost(id));
      console.log("Dispatched deletePost for id:", id);

      // optional: re-fetch my posts if you want fresh server state
      // getMyPosts();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  useEffect(() => {
    getMyPosts();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row">
      <div>
        <DashboardHeader />
        <ImageAdd />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5 bg-transparent sm:bg-white p-5 w-[90vw] sm:w-[55vw] sm:h-[95vh] sm:overflow-y-scroll rounded-lg mx-auto sm:mx-0">
        {posts.length > 0 ? (
          posts.map(({ _id, title, image, author, price }) => (
            <ImageCard
              key={_id}
              id={_id}
              title={title}
              img={image}
              author={author}
              price={price}
              icon1={
                <BiSolidMessageSquareEdit
                title="Edit"
                onClick={() => handleOpenEdit({ _id, title, image, author, price })}
                className="text-3xl text-black cursor-pointer hover:scale-110 transition-all ease-linear duration-300"
              />
              }

              icon2={
                <MdDelete
                  title="Delete"
                  onClick={() => handleDelete(_id)}
                  className="text-3xl text-red-500 cursor-pointer hover:scale-110 transition-all ease-linear duration-300"
                />
              }
            />
          ))
        ) : (
          <p className="text-gray-500 italic">No posts uploaded yet</p>
        )}
      </div>
      {/* Edit modal */}
      {editingPost && <EditPostModal post={editingPost} onClose={handleCloseEdit} />}
    </div>
  );
};

export default PhotoManagement;

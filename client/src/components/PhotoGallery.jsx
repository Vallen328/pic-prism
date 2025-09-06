// src/components/PhotoGallery/PhotoGallery.jsx
import { FaShoppingCart } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";
import ImageCard from "./ImageCard"; // keep relative path if ImageCard is here
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAllPosts } from "../../store/slices/postSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PhotoGallery = ({photos}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const posts = useSelector((state) => state.posts.allPosts);
  console.log("PhotoGallery posts (redux):", posts.map(p => String(p._id)));
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // local state for favourites (array of postIds)
  const [favouritesIds, setFavouritesIds] = useState([]);

  const getAllImages = async () => {
    try {
      if (posts.length > 0 || photos) return;
      const res = await axios.get(import.meta.env.VITE_API_URL + "/post/all");
      // backend may return { success, data } or direct array
      const postsData = res.data?.data ?? res.data;
      console.log("All posts:", postsData);
      dispatch(setAllPosts(postsData));
    } catch (err) {
      console.error("Failed to fetch images:", err);
      toast.error("Failed to load images");
    }
  };

  const fetchFavourites = async () => {
    if (!localStorage.getItem("accessToken")) return;
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/post/favourites", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      });
      const favs = res.data?.data ?? res.data;
      // store just the ids for fast lookup
      setFavouritesIds(favs.map((p) => p._id));
    } catch (err) {
      console.error("Failed to fetch favourites:", err);
    }
  };

  const addToFavourites = async (postId) => {
    if (!isAuthenticated) {
      toast.error("Please login to add favourites");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + `/post/addToFavourites/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        }
      );
      toast.success(res.data?.message || "Added to favourites");
      setFavouritesIds((prev) => Array.from(new Set([...prev, postId])));
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add to favourites");
      console.error(error);
    }
  };

  const removeFromFavourites = async (postId) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + `/post/removeFromFavourites/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        }
      );
      toast.success(res.data?.message || "Removed from favourites");
      setFavouritesIds((prev) => prev.filter((id) => id !== postId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not remove from favourites");
      console.error(error);
    }
  };

  const toggleFavourite = (postId) => {
    if (favouritesIds.includes(postId)) {
      removeFromFavourites(postId);
    } else {
      addToFavourites(postId);
    }
  };

  // ---------- payment handlers kept from your earlier implementation ----------
  const purchaseImage = async (price, id, postUrl, author, title) => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase asset");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/payment/generate",
        { price },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );

      const data = res.data?.data ?? res.data;
      await handlePaymentVerify(data, id, postUrl, author, title, price);
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment init failed");
    }
  };

  const handlePaymentVerify = async (data, id, postUrl, author, title, price) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "PIC-PRISM",
      order_id: data.id,
      theme: { color: "#5f63b8" },
      handler: async (response) => {
        try {
          const res = await axios.post(
            import.meta.env.VITE_API_URL + "/payment/verify",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              postId: id,
              postUrl,
              author,
              title,
              price,
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
              withCredentials: true,
            }
          );
          const data = res.data;
          toast.success(data.message);
        } catch (error) {
          toast.error(error.response?.data?.message || "Payment verification failed");
        }
      },
    };
    const razorpayWindow = new window.Razorpay(options);
    razorpayWindow.open();
  };

  // -------------------------------------------------------------------------

  useEffect(() => {
    getAllImages();
    fetchFavourites();
  }, []);

    const displayPosts = photos || posts;


  return (
    <div className="my-20 bg-white flex flex-col justify-center items-center">
      <h3 className="text-3xl font-semibold my-14">Photos</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-20">
        {displayPosts?.map(({ _id, title, image, price, author }) => {
          const isFav = favouritesIds.includes(_id);
          return (
            <ImageCard
              key={_id}
              id={_id}
              title={title}
              author={author}
              img={image}
              price={price}
              icon1={
                <FaShoppingCart
                  title="Buy"
                  onClick={() => purchaseImage(price, _id, image, author, title)}
                  className="text-2xl text-black cursor-pointer hover:scale-110 transition-all ease-linear duration-300"
                />
              }
              icon2={
                <IoIosHeart
                  title={isFav ? "Remove from favourites" : "Add to favourites"}
                  onClick={() => toggleFavourite(_id)}
                  className={`text-2xl cursor-pointer hover:scale-110 transition-all ease-linear duration-300 ${
                    isFav ? "text-red-500" : "text-gray-400"
                  }`}
                />
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default PhotoGallery;    
import { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import PhotoGallery from "../components/PhotoGallery";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAllPosts } from "../../store/slices/postSlice";

const Home = () => {
  const dispatch = useDispatch();

  const fetchAll = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/post/all");
      const posts = res.data?.data ?? res.data;
      dispatch(setAllPosts(posts));
    } catch (err) {
      console.error("Failed to fetch all posts:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="mt-36">
      <HeroSection />
      <PhotoGallery />
    </div>
  );
};

export default Home;

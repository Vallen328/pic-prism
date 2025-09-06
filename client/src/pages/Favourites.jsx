import React, { useEffect, useState } from "react";
import axios from "axios";
import PhotoGallery from "../components/PhotoGallery";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/post/favourites", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setFavourites(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">My Favourites</h1>

      {favourites.length === 0 ? (
        <p>No favourites added yet ❤️</p>
      ) : (
        <PhotoGallery photos={favourites} />
      )}
    </div>
  );
};

export default Favourites;

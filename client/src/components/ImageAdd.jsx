import React, { useState } from "react";
import toast from "react-hot-toast";
import useUpload from "../hooks/useUpload";
import axios from "axios";
import { useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";

const ImageAdd = () => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const author = useSelector((state) => state.auth.author);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const onUploadProgress = (progressEvent) =>
    setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));

  const addPost = async (e) => {
    e.preventDefault();
    try {
      const title = e.target.title.value;
      const price = e.target.price.value;

      if (!title || !price) return toast.error("Please fill all the fields.");
      if (title.trim() === "" || price.trim() === "")
        return toast.error("Please fill all the feilds");

      const { public_id, secure_url } = await useUpload({
        image,
        onUploadProgress,
      });

      if (!public_id || !secure_url) return toast.error("Image upload failed");

      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/post/create",
        {
          title,
          price,
          image: secure_url,
          publicId: public_id,
          author,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );

      const data = await res.data;
      if (data.success == true) {
        toast.success(data.message);
        e.target.reset();
        setImage(null);
        setProgress(0);
      }
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  return (
    <div className="p-5 bg-white mx-9 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold">Add New Product</h2>
      <form className="gird grid-cols-1 gap-2 my-4" onSubmit={addPost}>
        <img
          src={`${
            image
              ? URL.createObjectURL(image)
              : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKkAAACUCAMAAADf7/luAAAALVBMVEX09PTMzMzJycnPz8/4+PjW1tba2tru7u7q6url5eXi4uLx8fHS0tLf39/GxsZCy9JcAAAB2UlEQVR4nO3Z7W6DIBhAYUEQUOz9X+78rOLaFJbNlyXn+duZnoKI06YBAAAAAAAAAAAAAADAnxqEvjfYtlDsgkCnGbVWpbQaze2lvrxzaXV3h5pu+tpoy8Tp13W3D6qdSodS0zH27tCltHR4jHipMXnN0qXG9X0YclqFSwc7rROtx4xjZEtdXC9Xuvt8jGzpuF9X9ef9R7R0OC7q8eOpKlrqHkfqt7Dg03jRUn8qvdwqmaBUmio7+8f2Hy9/EeYfEc6psivKPldUep0yYf3gPKqypfs9lW6Tu6R56tU1VbbU+Ha67msVXTLP4Th/jxNAeI8ybuxs1yfLaZ/6y6hK7/vN/A9SusaDSuypFZSmzlO/bV/bvUxlpenUn8/VSkr3+77r1J9GtY7SqPwW+nhRqnRfS2m3LZxXU7+muipKzbJTtc68nPrFo47SdhtI/3rqqykdnnt/+66zjlJjcx6n1FAas577yJcONqezhtLMUPlS/3axV1ea+3CS0t8vFd9N/UPnER9T1+WSLp2fneZppEtL/JtS04iULu9Osk/SVVQC706MX55El5kvVv7m0PmF1E9enen7X0dNqX1sVdFrU9XGXiB0Sh1cKYlMAAAAAAAAAAAAAAAA3OEL/KwV0PUnOcMAAAAASUVORK5CYII="
          }`}
          alt="this picture"
          className="w-[350px] h-[25vh] sm:h-[30vh] rounded-lg object-cover"
        />

        {/* Show a progress bar */}

        {progress > 0 && (
          <ProgressBar
            completed={progress}
            bgColor="black"
            transitionTimingFunction="ease-in-out"
          />
        )}

        <div className="flex flex-col">
            <label htmlFor="image" className="font-bold mb-1">Image</label>
  
            <label htmlFor="image" className="cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition">
            Choose File
            </label>
  
            <input
            type="file"
            name="image"
            id="image"
            onChange={handleImageChange}
            className="hidden"
            />
        </div>

        <div className="flex flex-col">
          <label htmlFor="title" className="font-bold">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="rounded-lg border outline-none px-3 py-1 mt-1"
            placeholder="Beautiful Flower"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="price" className="font-bold">
            Price
          </label>
          <input
            type="text"
            name="price"
            id="price"
            required
            className="rounded-lg border outline-none px-3 py-1 mt-1"
            placeholder="45"
          />
        </div>
        <button
          type="submit"
          className="py-1 px-3 bg-black font-semibold text-white rounded-lg mt-2"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ImageAdd;
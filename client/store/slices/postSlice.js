import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    allPosts: [],
    myPosts: [],
  },
  reducers: {
    setAllPosts: (state, action) => {
      state.allPosts = action.payload;
    },
    setMyPosts: (state, action) => {
      state.myPosts = action.payload;
    },
    deletePost: (state, action) => {
      const id = String(action.payload);
      state.myPosts = state.myPosts.filter((p) => String(p._id) !== id);
      state.allPosts = state.allPosts.filter((p) => String(p._id) !== id);
    },
    updatePost: (state, action) => {
      const updated = action.payload;
      state.myPosts = state.myPosts.map((p) =>
        String(p._id) === String(updated._id) ? updated : p
      );
      state.allPosts = state.allPosts.map((p) =>
        String(p._id) === String(updated._id) ? updated : p
      );
    },
  },
});

export const { setAllPosts, setMyPosts, deletePost, updatePost } = postSlice.actions;
export default postSlice.reducer;
    
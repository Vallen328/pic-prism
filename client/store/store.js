import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice"
import navSlice from "./slices/navSlice";
import postSlice from "./slices/postSlice"; // Import the postSlice

export const store = configureStore({
    reducer : {
        "key to identify slice" : "slice file",
        //shakkar : shakkarSlice,
        auth : authSlice,
        nav: navSlice,
        posts: postSlice, 
    },
}); 
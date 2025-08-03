import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice"

export const store = configureStore({
    reducer : {
        "key to identify slice" : "slice file",
        //shakkar : shakkarSlice,
        auth : authSlice,
    },
}); 
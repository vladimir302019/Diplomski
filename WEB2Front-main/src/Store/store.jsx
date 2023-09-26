import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import adminSlice from "./adminSlice";
import articleSlice from "./articleSlice";
import cartSlice from "./cartSlice";
import orderSlice from "./orderSlice";

const store = configureStore({
    reducer:{user: userSlice, admin: adminSlice, article: articleSlice, cart: cartSlice, order: orderSlice},
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false,}),
});

export default store;
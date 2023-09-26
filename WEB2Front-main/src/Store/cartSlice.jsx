import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    cartArticles : localStorage.getItem("cartArticles") !== null ? JSON.parse(localStorage.getItem("cartArticles")) : [],
    totalPrice: localStorage.getItem("totalPrice") !== null ? JSON.parse(localStorage.getItem("totalPrice")) : 0,
    shipping: localStorage.getItem("shipping") !== null ? JSON.parse(localStorage.getItem("shipping")) : null,
    payment: localStorage.getItem("payment") !== null ? JSON.parse(localStorage.getItem("payment")) : null,
};

const storeCart = (state) => {
    localStorage.setItem("cartArticles", JSON.stringify(state.cartArticles));
    localStorage.setItem("totalPrice", state.totalPrice);
  };

const setShipping = (state) => {
    localStorage.setItem("shipping", JSON.stringify(state.shipping));
};
const setPayment = (state) => {
    localStorage.setItem("payment", JSON.stringify(state.payment));
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:
    {
        addToCart(state, action) {
            const article = state.cartArticles.find(a => a.id === action.payload.id);
          
            if (!article) {
              state.cartArticles.push(action.payload);
            } else {
                if(article.maxQuantity < article.quantity+ action.payload.quantity)
                {
                    toast.error("Max quantity reached!",{
                        position: "top-center",
                        autoClose: 2500,
                        closeOnClick: true,
                        pauseOnHover: false,
                    });
                }else{
              article.quantity += action.payload.quantity;
            }}

            state.totalPrice = state.cartArticles.reduce((total, article) => {
              return total + article.quantity * article.price;
            }, 0);
          
            storeCart(state);
          },
          
        removeFromCart(state, action){
            const article = state.cartArticles.find(a => a.id === action.payload.id);
            if(!article){
                return;
            }

            state.cartArticles = state.cartArticles.filter(a => a.id !== action.payload.id);
            state.totalPrice -= article.price * article.quantity;

            storeCart(state);
        },
        clearCart(state, action){
            state.cartArticles = [];
            state.totalPrice = 0;
            state.shipping = null;
            state.payment = null;

            localStorage.removeItem("cartArticles");
            localStorage.removeItem("totalPrice");
            localStorage.removeItem("shipping");
            localStorage.removeItem("payment");
        },
        updateCart(state, action){
           
            const article = state.cartArticles.find(a => a.id === action.payload.article.id);
            if(article.maxQuantity < article.quantity+ action.payload.newQuantity)
            {
                toast.error("Max quantity reached!",{
                    position: "top-center",
                    autoClose: 2500,
                    closeOnClick: true,
                    pauseOnHover: false,
                });
            }
            else
             {  
                 article.quantity += action.payload.newQuantity;
             }
            state.cartArticles.push(action.payload.article);
            state.totalPrice += article.quantity * article.price;
            storeCart(state);
        },
    },
});


export const { addToCart, removeFromCart, clearCart, updateCart} = cartSlice.actions;
export default cartSlice.reducer;
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Register from "../Components/Register/Register"
import SignIn from "../Components/SignIn/SignIn"
import ProfilePage from "../Components/Profile/Profile";
import Menu from "../Components/Menu/Menu";
import AdminPanel from "../Components/AdminPanel/AdminPanel";
import StorePanel from "../Components/StorePanel/StorePanel";
import Checkout from "../Components/StorePanel/Checkout/Checkout";
import SellerPanel from "../Components/SellerPanel/SellerPanel";
import OrdersPanel from "../Components/OrdersPanel/OrdersPanel";
import PayPalReview from "../Components/StorePanel/PayPalReview"
import Map from "../Components/SellerPanel/Map"

const AppRoutes = () => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const user = useSelector((state) => state.user.user);
    const isApprovedSeller = user && user.type === 0 && user.approved;
    const isBuyer = user && user.type === 1;
    const isAdmin = user && user.type === 2;

    return (
        <Routes>
            {!isLoggedIn && (
            <>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/signin" element={<SignIn/>}></Route>
            <Route path="*" element={<Navigate replace to={"/signin"} />}></Route>
            </>
            )}
            {isLoggedIn && (
            <>
            <Route path="/profile" element={<ProfilePage/>}></Route>
            <Route path="/menu" element={<Menu/>}></Route>
            <Route path="/orders" element={<OrdersPanel/>}></Route>
            <Route path="" element={<Navigate replace to={"/menu"} />}></Route>
            </>
            )}
            {isLoggedIn && isAdmin &&(
            <>
            <Route path="/adminPanel" element={<AdminPanel/>}></Route>
            </>
            )}
            {isLoggedIn &&  isBuyer &&(
            <>
            <Route path="/store" element={<StorePanel/>}></Route>
            <Route path="/review" element={<PayPalReview/>}/>
            </>
            )}
            {isLoggedIn && isBuyer && (
            <>
            <Route path="/checkout" element={<Checkout/>}></Route>
            </>
            )}
            {isLoggedIn && isApprovedSeller && (
            <>
            <Route path="/sellerPanel" element={<SellerPanel/>}/>
            <Route path="/map" element={<Map/>}/>
            </>
            )}
        </Routes>
    );
}

export default AppRoutes;
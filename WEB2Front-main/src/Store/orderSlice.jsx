import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {NewOrder, GetOrder, GetOrders, GetSellerNewOrders, GetSellerOldOrders, GetUndeliveredOrders, GetUserOrders, CancelOrder, AddOrderItems, ApproveOrder} from '../Services/OrderService';

const initialState = {
    deliveredOrders: localStorage.getItem("deliveredOrders") !== null ? JSON.parse(localStorage.getItem("deliveredOrders")) : [],
    undeliveredOrders: localStorage.getItem("undeliveredOrders") !== null ? JSON.parse(localStorage.getItem("undeliveredOrders")) : [],
    order: localStorage.getItem("order") !== null ? JSON.parse(localStorage.getItem("order")) : null,
    orderId: 0,
};

const setDeliveredOrders = (state) => {
    localStorage.setItem("deliveredOrders", JSON.stringify(state.deliveredOrders));
};
const setUndeliveredOrders = (state) => {
    localStorage.setItem("undeliveredOrders", JSON.stringify(state.undeliveredOrders));
};

export const newOrderAction =  createAsyncThunk(
    "order/new-order",
    async(data,thunkApi) => {
        try{
            const response = await NewOrder(data);
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const getOrderAction =  createAsyncThunk(
    "order/get-order",
    async(data,thunkApi) => {
        try{
            const response = await GetOrder(data);
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const getOrdersAction =  createAsyncThunk(
    "order/get-orders",
    async(data,thunkApi) => {
        try{
            const response = await GetOrders();
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const getUserOrdersAction =  createAsyncThunk(
    "order/get-user-orders",
    async(data,thunkApi) => {
        try{
            const response = await GetUserOrders();
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const getUndeliveredOrdersAction =  createAsyncThunk(
    "order/get-undelivered-orders",
    async(data,thunkApi) => {
        try{
            const response = await GetUndeliveredOrders();
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const getSellerOldOrdersAction =  createAsyncThunk(
    "order/get-seller-old-orders",
    async(data,thunkApi) => {
        try{
            const response = await GetSellerOldOrders();
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const getSellerNewOrdersAction =  createAsyncThunk(
    "order/get-seller-new-orders",
    async(data,thunkApi) => {
        try{
            const response = await GetSellerNewOrders();
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const cancelOrderAction = createAsyncThunk(
    "order/cancel-order",
    async(data,thunkApi) => {
        try{
            const response = await CancelOrder(data);
            return thunkApi.fulfillWithValue(response.data);
        } catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const addOrderItemsAction = createAsyncThunk(
    "order/add-order-items",
    async(data,thunkApi) => {
        try{
            const response = await AddOrderItems(data);
            return thunkApi.fulfillWithValue(response.data);
        } catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);
export const approveOrderAction = createAsyncThunk(
    "order/approve-order",
    async(data,thunkApi) => {
        try{
            const response = await ApproveOrder(data);
            return thunkApi.fulfillWithValue(response.data);
        } catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers:
        {   
            clearAll(state) {
                state.deliveredOrders = [];
                state.undeliveredOrders = [];
                state.order = null;

                localStorage.removeItem("deliveredOrders");
                localStorage.removeItem("undeliveredOrders");
                localStorage.removeItem("order");
            },
        },
    extraReducers: (builder) => {
        builder.addCase(newOrderAction.fulfilled, (state,action)=> {
            state.orderId = action.payload;
            localStorage.setItem("orderId", action.payload);
            toast.success("Successfully created new order",{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(newOrderAction.rejected, (state, action) => {
            let error = "Creating new order error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(getOrderAction.fulfilled, (state,action)=> {
            state.order = JSON.parse(action.payload);
        });
        builder.addCase(getOrderAction.rejected, (state, action) => {
            let error = "Fetching order error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(getOrdersAction.fulfilled, (state,action)=> {
            state.deliveredOrders = [...action.payload];
            setDeliveredOrders(state);
        });
        builder.addCase(getOrdersAction.rejected, (state, action) => {
            let error = "Fetching orders error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(getUserOrdersAction.fulfilled, (state,action)=> {
            state.deliveredOrders = action.payload;
            setDeliveredOrders(state);
        });
        builder.addCase(getUserOrdersAction.rejected, (state, action) => {
            let error = "Fetching user orders error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(getUndeliveredOrdersAction.fulfilled, (state,action)=> {
            state.undeliveredOrders = [...action.payload];
            setUndeliveredOrders(state);
        });
        builder.addCase(getUndeliveredOrdersAction.rejected, (state, action) => {
            let error = "Fetching undelivered orders error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(getSellerNewOrdersAction.fulfilled, (state,action)=> {
            state.undeliveredOrders = [...action.payload];
            setUndeliveredOrders(state);
        });
        builder.addCase(getSellerNewOrdersAction.rejected, (state, action) => {
            let error = "Fetching seller new orders error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(getSellerOldOrdersAction.fulfilled, (state,action)=> {
            state.deliveredOrders = [...action.payload];
            setDeliveredOrders(state);
        });
        builder.addCase(getSellerOldOrdersAction.rejected, (state, action) => {
            let error = "Fetching seller old orders error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(addOrderItemsAction.fulfilled, (state,action)=> {
            toast.success("Adding order items success!",{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(addOrderItemsAction.rejected, (state, action) => {
            let error = "Adding order items error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(cancelOrderAction.fulfilled, (state,action)=> {
            toast.success("Cancel success!",{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });

        });
        builder.addCase(cancelOrderAction.rejected, (state, action) => {
            let error = "Cancel error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(approveOrderAction.fulfilled, (state,action)=> {
            toast.success("Approve success!",{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });

        });
        builder.addCase(approveOrderAction.rejected, (state, action) => {
            let error = "Approve error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

    }, 
});

export const {clearAll} = orderSlice.actions;
export default orderSlice.reducer;
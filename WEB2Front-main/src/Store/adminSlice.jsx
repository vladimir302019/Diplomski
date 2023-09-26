import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {GetInactiveSellers , GetActiveSellers, ApproveSeller} from "../Services/UserService";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    allSellers: [],
    inactiveSellers: [],
};

export const getInactiveSellersAction = createAsyncThunk(
    "admin/unactivated-sellers",
    async (data, thunkApi) => {
        try{
            const response = await GetInactiveSellers();
            return thunkApi.fulfillWithValue(response.data);
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

export const getActiveSellersAction = createAsyncThunk(
    "admin/activated-sellers",
    async (data, thunkApi) => {
        try{
            const response = await GetActiveSellers();
            return thunkApi.fulfillWithValue(response.data);
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

export const approveSellerAction = createAsyncThunk(
    "admin/activate-user",
    async (data, thunkApi) => {
        try{
            const response = await ApproveSeller(data);
            return thunkApi.fulfillWithValue(response.data);
        } catch (error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearAllSellers(state) {
            state.allSellers = [];
        },
        clearInactiveSellers(state){
            state.inactiveSellers = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getInactiveSellersAction.fulfilled, (state,action) => {
            state.inactiveSellers = [...action.payload];
        });
        builder.addCase(getInactiveSellersAction.rejected, (state, action)=> {
            let error = "Fetching inactive sellers error";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(getActiveSellersAction.fulfilled, (state,action) => {
            state.allSellers = [...action.payload];
        });
        builder.addCase(getActiveSellersAction.rejected, (state, action)=> {
            let error = "Fetching active sellers error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(approveSellerAction.fulfilled, (state, action)=> {
            toast.success("Successfully verified seller!", {
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
              });
        });
        builder.addCase(approveSellerAction.rejected, (state, action) => {
            let error = "Seller approval failed!"; // Make a default error message constant somewhere
            if (typeof action.payload === "string") {
                error = action.payload;
            }

            toast.error(error, {
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        })
    },
});

export const {clearAllSellers, clearInactiveSellers} = adminSlice.actions;
export default adminSlice.reducer;